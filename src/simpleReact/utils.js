import { SR_ELEMENT } from './constants';

export function applyLifeCycle(instance, name, a, b) {
  if (instance.element.$$type === SR_ELEMENT.CLASS) {
    instance.componentInstance[name](a, b);
  }
}
