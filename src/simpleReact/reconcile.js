import { SR_ELEMENT } from "./constants";
import { updateNode } from "./dom";
import createInstance from "./createInstance";

export default function reconcile(newElement, currentInstance, parentNode) {
  let newInstance;
  if (!currentInstance) {
    // add
    newInstance = createInstance(newElement);
    parentNode.appendChild(newInstance.dom);
    applyLifeCycle(newInstance, "componentDidMount");
    return newInstance;
  }
  const { element, dom, children, publicInstance, child } = currentInstance;
  if (!newElement) {
    // remove
    applyLifeCycle(currentInstance, "componentWillUnmount");
    parentNode.removeChild(dom);
    return null;
  }
  // update
  switch (newElement.$$type) {
    case SR_ELEMENT.TEXT: {
      updateNode(dom, newElement.props, element.props);
      currentInstance.element = newElement;
      return currentInstance;
    }
    case SR_ELEMENT.NODE: {
      if (element.type !== newElement.type) {
        newInstance = createInstance(newElement);
        parentNode.replaceChild(newInstance.dom, dom);
        return newInstance;
      } else {
        updateNode(dom, newElement.props, element.props);
        currentInstance.element = newElement;
        const len = Math.max(newElement.props.children.length, children.length);
        currentInstance.children = Array.from({ length: len })
          .map((_, i) =>
            reconcile(newElement.props.children[i], children[i], dom)
          )
          .filter(inst => inst != null);
        return currentInstance;
      }
    }
    case SR_ELEMENT.FUNCTION: {
      const el = newElement.type(newElement.props);
      const inst = reconcile(el, child, dom);
      currentInstance.child = inst;
      currentInstance.element = newElement;
      return currentInstance;
    }
    case SR_ELEMENT.CLASS: {
      const prevProps = publicInstance.props;
      const prevState = publicInstance.state;
      publicInstance.props = { ...prevProps, ...newElement.props };
      publicInstance.state = { ...prevState, ...publicInstance._queueState };
      publicInstance._queueState = null;
      const el = publicInstance.render();
      const inst = reconcile(el, child, dom);
      currentInstance.child = inst;
      currentInstance.element = newElement;
      applyLifeCycle(
        currentInstance,
        "componentDidUpdate",
        prevProps,
        prevState
      );
      return currentInstance;
    }
  }
}

function applyLifeCycle(instance, name, a, b) {
  if (instance.element.$$type === SR_ELEMENT.CLASS) {
    instance.publicInstance[name](a, b);
  }
}
