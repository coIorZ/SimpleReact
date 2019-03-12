import SimpleReact from "./simpleReact";

const Footer = ({ children }) => (
  <div style="margin-top:50px;">
    <span>{children}</span>
  </div>
);

class Counter extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    }
  }

  render() {
    const {count} = this.state;
    return (
      <div>
        <button onClick={() => {this.setState({count: count + 1})}}>add</button>
        <span style="margin-left:10px;">{count}</span>
      </div>
    )
  }
}

const App = () => (
  <div>
    <h1>Hello World</h1>
    <Counter />
    <Footer>by SimpleReact</Footer>
  </div>
);

SimpleReact.render(<App />, document.querySelector("#app"));
