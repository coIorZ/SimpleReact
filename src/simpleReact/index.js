import createElement from "./createElement";
import reconcile from "./reconcile";
import Component from "./component";

function render(element, container) {
  const instance = reconcile(element);
  container.appendChild(instance.dom);
}

const React = {
  createElement,
  render,
  Component
};

export default React;
