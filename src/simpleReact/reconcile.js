import { SR_ELEMENT } from './constants';
import { updateNode } from './dom';
import createInstance from './createInstance';

export default function reconcile(
  newElement,
  currentInstance,
  parentNode,
  transaction
) {
  let newInstance;
  if (!currentInstance) {
    // add
    newInstance = createInstance(newElement, transaction);
    parentNode.appendChild(newInstance.dom);
    return newInstance;
  }
  const { element, dom, componentInstance, child } = currentInstance;
  if (!newElement) {
    // remove
    if (componentInstance) {
      componentInstance.componentWillUnmount();
    }
    parentNode.removeChild(dom);
    return null;
  }
  if (
    newElement.key !== currentInstance.element.key ||
    newElement.$$type !== currentInstance.element.$$type
  ) {
    reconcile(null, currentInstance, parentNode, transaction);
    return reconcile(newElement, null, parentNode, transaction);
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
        newInstance = createInstance(newElement, transaction);
        parentNode.replaceChild(newInstance.dom, dom);
        return newInstance;
      } else {
        updateNode(dom, newElement.props, element.props);
        currentInstance.element = newElement;
        currentInstance.children = reconcileChildren(
          newElement,
          currentInstance,
          transaction
        );
        return currentInstance;
      }
    }
    case SR_ELEMENT.FUNCTION: {
      const el = newElement.type(newElement.props);
      const inst = reconcile(el, child, dom, transaction);
      currentInstance.child = inst;
      currentInstance.element = newElement;
      return currentInstance;
    }
    case SR_ELEMENT.CLASS: {
      const prevProps = componentInstance.props;
      const prevState = componentInstance.state;
      const nextProps = { ...prevProps, ...newElement.props };
      const nextState = componentInstance._pendingState.reduce(
        (ret, state) => ({
          ...ret,
          ...state,
        }),
        prevState
      );
      if (componentInstance.shouldComponentUpdate(nextProps, nextState)) {
        componentInstance.props = nextProps;
        componentInstance.state = nextState;
        const el = componentInstance.render();
        const inst = reconcile(el, child, dom, transaction);
        currentInstance.child = inst;
        transaction.lifeCycleQueue.enqueue(
          componentInstance,
          'componentDidUpdate',
          prevProps,
          prevState
        );
      }
      componentInstance.props = nextProps;
      componentInstance.state = nextState;
      componentInstance._pendingState.length = 0;
      currentInstance.element = newElement;
      return currentInstance;
    }
  }
}

function reconcileChildren(newElement, currentInstance, transaction) {
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
        dom,
        transaction
      );
    } else {
      newInst = reconcile(element, noKeyInstances[j], dom, transaction);
      j++;
    }
    if (newInst) {
      ret.push(newInst);
    }
  }
  reorderChildren(ret, dom);
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

function reorderChildren(instances, parentNode) {
  const nodes = parentNode.children;
  instances.forEach((inst, i) => {
    if (inst.element.$$type !== SR_ELEMENT.TEXT && inst.dom !== nodes[i]) {
      parentNode.insertBefore(inst.dom, nodes[i + 1]);
    }
  });
}
