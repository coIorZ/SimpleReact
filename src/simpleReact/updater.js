import transactionify from './transactionify';
import CallbackQueue from './CallbackQueue';
import reconcile from './reconcile';

let isBatchUpdating = false;
const dirtyComponent = [];
const noop = function() {};
const lifeCycleQueue = new CallbackQueue();

const lifeCycleAction = {
  initialize: () => {
    lifeCycleQueue.reset();
  },
  close: () => {
    lifeCycleQueue.notifyAll();
  },
};

const batchUpdateAction = {
  initialize: noop,
  close: () => {
    isBatchUpdating = false;
  },
};

const flushAction = {
  initialize: noop,
  close: () => {
    while (dirtyComponent.length) {
      const component = dirtyComponent.shift();
      component._performUpdate(transaction);
    }
  },
};

const transaction = Object.assign(
  {},
  transactionify([lifeCycleAction, flushAction, batchUpdateAction]),
  {
    lifeCycleQueue,
  }
);

const render = (element, container) => {
  isBatchUpdating = true;
  return transaction.perform(reconcile, element, null, container, transaction);
};

const batchUpdate = (component, partialState) => {
  component._pendingState.push(partialState);
  if (!isBatchUpdating) {
    component._performUpdate(transaction);
  } else if (dirtyComponent.indexOf(component) === -1) {
    dirtyComponent.push(component);
  }
};

export { render, batchUpdate };
