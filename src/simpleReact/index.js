import createElement from "./createElement";
import createInstance from "./createInstance";
import Component from './component'

function render(element, container) {
  const instance = createInstance(element);
  container.appendChild(instance.dom);
  console.log(instance);
}

const React = {
  createElement,
  render,
  Component
};

export default React;
