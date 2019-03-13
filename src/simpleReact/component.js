import reconcile from "./reconcile";

class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  render() {
    return null;
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    this._internalInstance = updateInstance(this._internalInstance);
  }

  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
}

function updateInstance(instance) {
  return reconcile(instance.element, instance, instance.dom.parentNode);
}

export default Component;
