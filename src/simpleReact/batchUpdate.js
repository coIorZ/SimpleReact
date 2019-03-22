import batchStrategyTransaction from './batchStrategyTransaction';

export default (callback, a, b, c, d) => {
  const isBatchUpdating = batchStrategyTransaction.isBatchUpdating;
  batchStrategyTransaction.isBatchUpdating = true;
  if (isBatchUpdating) {
    return callback(a, b, c, d);
  } else {
    return batchStrategyTransaction.perform(callback, a, b, c, d);
  }
};
