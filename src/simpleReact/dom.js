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
    Object.keys(prevProps)
      .filter(isAttr)
      .forEach(key => {
        if (!props.hasOwnProperty(key)) {
          removeAttribute(node, key);
        }
      });
    Object.keys(props)
      .filter(isAttr)
      .forEach(key => {
        if (props[key] !== prevProps[key]) {
          updateAttribute(node, key, props[key]);
        }
      });
    handleListeners(prevProps, (eventName, handler) => {
      node.removeEventListener(eventName, handler);
    });
    handleListeners(props, (eventName, handler) => {
      node.addEventListener(eventName, handler);
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

function isListener(str) {
  return str.startsWith('on');
}

function isAttr(str) {
  return !isListener(str) && str !== 'children';
}

function removeAttribute(node, key) {
  if (key === 'value') {
    node.value = '';
  } else {
    node.removeAttribute(key);
  }
}

function updateAttribute(node, key, value) {
  if (key === 'value') {
    node.value = value;
  } else {
    node.setAttribute(key, value);
  }
}
