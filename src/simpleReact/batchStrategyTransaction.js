import transactionify from './transactionify';
import reconcileTransaction from './reconcileTransaction';

const noop = function() {};

const batchStrategy = {
  isBatchUpdating: false,
  dirtyComponents: [],
};

const flushUpdateAction = {
  initialize: noop,
  close: () => {
    while (batchStrategy.dirtyComponents.length) {
      const component = batchStrategy.dirtyComponents.shift();
      component._performUpdate(reconcileTransaction);
    }
  },
};

const resetBatchAction = {
  initialize: noop,
  close: () => {
    batchStrategy.isBatchUpdating = false;
  },
};

export default transactionify(
  [flushUpdateAction, resetBatchAction],
  batchStrategy
);
