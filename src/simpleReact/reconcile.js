import { updateNode } from "./dom";
import createInstance from "./createInstance";

export default function reconcile(newElement, currentInstance) {
  if (!currentInstance) {
    return createInstance(newElement);
  }
  let newInstance;
  const { element, dom, children } = currentInstance;
  if (!newElement) {
    newInstance = null;
    dom.parentNode.removeChild(dom);
  } else {
    if (element.type && element.type !== newElement.type) {
      newInstance = createInstance(newElement);
      dom.parentNode.replaceChild(newInstance.dom, dom);
    } else {
      updateNode(dom, newElement.props, element.props);
      newInstance = { dom, element: newElement, children: [] };
      newElement.props.children.forEach((newEl, index) => {
        const newInst = reconcile(newEl, children[index]);
        if (newInst) {
          newInstance.children.push(newInst);
        }
      });
    }
  }
  return newInstance;
}
