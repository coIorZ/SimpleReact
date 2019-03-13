import SimpleReact from "./simpleReact";

const Footer = ({ label, onClick }) => (
  <div style="margin-top:50px;">
    {label ? <span>{label}</span> : <button onClick={onClick}>show</button>}
  </div>
);

class Counter extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    const { count } = this.state;
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ count: count + 1 });
          }}
        >
          add
        </button>
        <span style="margin-left:10px;">{count}</span>
      </div>
    );
  }
}

class App extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      footerLabel: ""
    };
  }

  render() {
    const { footerLabel } = this.state;
    return (
      <div>
        <h1>Hello World</h1>
        <Counter />
        <Footer
          label={footerLabel}
          onClick={() => {
            this.setState({ footerLabel: "by SimpleReact" });
          }}
        />
      </div>
    );
  }
}

SimpleReact.render(<App />, document.querySelector("#app"));
