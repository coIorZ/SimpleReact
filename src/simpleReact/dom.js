export function createDomElementFromType(type) {
  return document.createElement(type);
}

export function createTextNodeFromString(str) {
  return document.createTextNode(str);
}

export function updateNode(node, props) {
  if (node.nodeType === 3) {
    node.nodeValue = props.nodeValue;
  } else {
    const listeners = Object.keys(props).filter(isListener);
    listeners.forEach(listener => {
      const eventName = listener.toLowerCase().substr(2);
      node.addEventListener(eventName, props[listener]);
    });
    const attrs = Object.keys(props).filter(
      p => !isListener(p) && p !== "children"
    );
    attrs.forEach(attr => {
      node.setAttribute(attr, props[attr]);
    });
  }
}

function isListener(str) {
  return str.startsWith("on");
}
