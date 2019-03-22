export default (actions, obj = {}) => {
  return Object.assign(obj, {
    perform: (callback, a, b, c, d) => {
      actions.forEach(action => {
        action.initialize();
      });
      const ret = callback(a, b, c, d);
      actions.forEach(action => {
        action.close();
      });
      return ret;
    },
  });
};
