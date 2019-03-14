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
  const { element, dom, publicInstance, child } = currentInstance;
  if (!newElement) {
    // remove
    applyLifeCycle(currentInstance, "componentWillUnmount");
    parentNode.removeChild(dom);
    return null;
  }
  if (newElement.$$type !== currentInstance.element.$$type) {
    newInstance = createInstance(newElement);
    parentNode.replaceChild(newInstance.dom, dom);
    return newInstance;
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
        currentInstance.children = reconcileChildren(
          newElement,
          currentInstance
        );
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

function reconcileChildren(newElement, currentInstance) {
  const ret = [];
  const elementChildren = newElement.props.children;
  const { children: instanceChildren, dom } = currentInstance;
  const commonKeys = getCommonKeys(elementChildren, instanceChildren);
  const noKeyInstances = instanceChildren.filter(
    inst => !commonKeys[inst.element.key]
  );
  const len = Math.max(elementChildren.length, instanceChildren.length);
  for (let i = 0, j = 0; i < len; i++) {
    let newInst;
    const element = elementChildren[i];
    if (element && commonKeys[element.key]) {
      newInst = reconcile(
        element,
        getInstanceByKey(instanceChildren, element.key),
        dom
      );
    } else {
      newInst = reconcile(element, noKeyInstances[j], dom);
      j++;
    }
    if (newInst) {
      ret.push(newInst);
    }
  }
  return ret;
}

function getCommonKeys(elements, instances) {
  const commonKeys = {};
  elements.forEach(el => {
    const key = el.key;
    if (key != null) {
      commonKeys[key] = false;
    }
  });
  instances.forEach(inst => {
    const key = inst.element.key;
    if (key != null && commonKeys[key] === false) {
      commonKeys[key] = true;
    }
  });
  return commonKeys;
}

function getInstanceByKey(instances, key) {
  return instances.find(inst => inst.element.key === key);
}
