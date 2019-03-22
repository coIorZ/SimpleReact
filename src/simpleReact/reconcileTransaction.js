import transactionify from './transactionify';
import CallbackQueue from './CallbackQueue';

const lifeCycleQueue = new CallbackQueue();

const lifeCycleAction = {
  initialize: () => {
    lifeCycleQueue.reset();
  },
  close: () => {
    lifeCycleQueue.notifyAll();
  },
};

export default transactionify([lifeCycleAction], { lifeCycleQueue });
