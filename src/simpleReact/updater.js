import reconcile from './reconcile';
import reconcileTransaction from './reconcileTransaction';
import batchStrategyTransaction from './batchStrategyTransaction';
import batchUpdate from './batchUpdate';

const mountElementIntoNode = (element, container) => {
  return reconcileTransaction.perform(
    reconcile,
    element,
    null,
    container,
    reconcileTransaction
  );
};

const render = (element, container) => {
  return batchUpdate(mountElementIntoNode, element, container);
};

const enqueueUpdate = (component, partialState) => {
  if (!batchStrategyTransaction.isBatchUpdating) {
    return batchUpdate(enqueueUpdate, component, partialState);
  }
  component._pendingState.push(partialState);
  if (batchStrategyTransaction.dirtyComponents.indexOf(component) === -1) {
    batchStrategyTransaction.dirtyComponents.push(component);
  }
};

export { render, enqueueUpdate };
