import createElement from "./createElement";
import createInstance from "./createInstance";

function render(element, container) {
  const instance = createInstance(element);
  container.appendChild(instance.dom);
  console.log(instance);
}

const React = {
  createElement,
  render
};

export default React;
