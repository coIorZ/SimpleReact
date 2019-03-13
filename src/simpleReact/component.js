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
    this._internalInstance = reconcile(this.render(), this._internalInstance);
  }
}

export default Component;
