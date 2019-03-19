import { SR_ELEMENT } from './constants';

export default function createElement(type, config, ...args) {
  const { key, ...props } = config || {};
  props.children = args.length
    ? args
        .flat()
        .filter(a => a != null && a !== false)
        .map(a => (isTextElement(a) ? createTextElement(a) : a))
    : [];
  let $$type = SR_ELEMENT.NODE;
  if (typeof type === 'function') {
    if (type.prototype && type.prototype.render) {
      $$type = SR_ELEMENT.CLASS;
    } else {
      $$type = SR_ELEMENT.FUNCTION;
    }
  }
  return { $$type, key, type, props };
}

function isTextElement(arg) {
  return typeof arg === 'string' || typeof arg === 'number';
}

function createTextElement(str) {
  return { $$type: SR_ELEMENT.TEXT, props: { nodeValue: str, children: [] } };
}
