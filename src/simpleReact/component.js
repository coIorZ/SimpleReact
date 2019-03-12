class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }

  render() {
    return null;
  }

  setState(partialState) {
    this.state = {...this.state, ...partialState};
  }
}

export default Component;
