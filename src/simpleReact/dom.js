export function createDomElementFromType(type) {
  return document.createElement(type);
}

export function createTextNodeFromString(str) {
  return document.createTextNode(str);
}

export function updateNode(node, props, prevProps = {}) {
  if (node.nodeType === 3) {
    if (props.nodeValue !== prevProps.nodeValue)
      node.nodeValue = props.nodeValue;
  } else {
    handleListeners(prevProps, (eventName, handler) => {
      node.removeEventListener(eventName, handler);
    });
    handleAttrs(prevProps, attr => {
      node.removeAttribute(attr);
    });
    handleListeners(props, (eventName, handler) => {
      node.addEventListener(eventName, handler);
    });
    handleAttrs(props, attr => {
      node.setAttribute(attr, props[attr]);
    });
  }
}

function handleListeners(props, cb) {
  const listeners = Object.keys(props).filter(isListener);
  listeners.forEach(listener => {
    const eventName = listener.toLowerCase().substr(2);
    cb(eventName, props[listener]);
  });
}

function handleAttrs(props, cb) {
  const attrs = Object.keys(props).filter(
    p => !isListener(p) && p !== "children"
  );
  attrs.forEach(cb);
}

function isListener(str) {
  return str.startsWith("on");
}
