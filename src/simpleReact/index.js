import createElement from "./createElement";
import reconcile from "./reconcile";
import Component from "./component";

function render(element, container) {
  reconcile(element, null, container);
}

const React = {
  createElement,
  render,
  Component
};

export default React;
