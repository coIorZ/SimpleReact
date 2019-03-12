import { SR_ELEMENT } from "./constants";

export default function createElement(type, config, ...args) {
  const props = { ...config };
  props.children = args.length
    ? args
        .filter(a => a != null && a !== false)
        .map(a => (typeof a === "string" ? createTextElement(a) : a))
    : [];
  let $$type = SR_ELEMENT.NODE;
  if (typeof type === "function") {
    if (type.prototype && type.prototype.render) {
      $$type = SR_ELEMENT.CLASS;
    } else {
      $$type = SR_ELEMENT.FUNCTION;
    }
  }
  return { $$type, type, props };
}

function createTextElement(str) {
  return { $$type: SR_ELEMENT.TEXT, props: { nodeValue: str, children: [] } };
}
