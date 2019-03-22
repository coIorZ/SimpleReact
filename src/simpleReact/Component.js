import { enqueueUpdate } from './updater';
import reconcile from './reconcile';

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
    this._pendingState = [];
  }

  render() {
    return null;
  }

  setState(partialState) {
    enqueueUpdate(this, partialState);
  }

  _performUpdate(transaction) {
    const instance = this._internalInstance;
    this._internalInstance = transaction.perform(
      reconcile,
      instance.element,
      instance,
      instance.dom,
      transaction
    );
  }

  componentWillMount() {}
  componentDidMount() {}
  shouldComponentUpdate() {
    return true;
  }
  componentDidUpdate() {}
  componentWillUnmount() {}
}

export default Component;
