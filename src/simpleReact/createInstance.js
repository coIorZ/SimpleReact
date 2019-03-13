import {
  createTextNodeFromString,
  createDomElementFromType,
  updateNode
} from "./dom";
import { SR_ELEMENT } from "./constants";

export default function createInstance(element) {
  const { $$type, type, props } = element;
  let dom;
  switch ($$type) {
    case SR_ELEMENT.TEXT: {
      dom = createTextNodeFromString("");
      break;
    }
    case SR_ELEMENT.NODE: {
      dom = createDomElementFromType(type);
      break;
    }
    case SR_ELEMENT.FUNCTION: {
      const processedProps = getFirstChild(props);
      const el = type(processedProps);
      const child = createInstance(el);
      return {element, dom: child.dom, child};
    }
    case SR_ELEMENT.CLASS: {
      const processedProps = getFirstChild(props);
      const publicInstance = new type(processedProps);
      const el = publicInstance.render();
      const child = createInstance(el);
      const instance = { element, dom: child.dom, child, publicInstance };
      publicInstance._internalInstance = instance;
      return instance;
    }
  }
  updateNode(dom, props);
  const instanceChildren = [];
  props.children.forEach(child => {
    const instance = createInstance(child);
    instanceChildren.push(instance);
    dom.appendChild(instance.dom);
  });
  return { element, dom, children: instanceChildren };
}

function getFirstChild(props) {
  if (props.children.length > 1) {
    throw new Error("Component Children length must be 1!");
  }
  return { ...props, children: props.children[0] };
}
