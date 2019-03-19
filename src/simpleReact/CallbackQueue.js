export default class CallbackQueue {
  constructor() {
    this._callbacks = [];
  }

  enqueue(component, method, a, b) {
    this._callbacks.push(component[method].bind(component, a, b));
  }

  notifyAll() {
    this._callbacks.forEach(cb => {
      cb();
    });
  }

  reset() {
    this._callbacks.length = 0;
  }
}
