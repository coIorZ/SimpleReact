import SimpleReact from "./simpleReact";

const Footer = ({ label }) => (
  <div style="margin-top:50px;">
    <span>{label}</span>
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
    const { label } = this.props;
    const { count } = this.state;
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ count: count + 1 });
          }}
        >
          {label}
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
      footerLabel: "",
      counterLabel: "add"
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ footerLabel: "by SimpleReact" });
    }, 2000);
  }

  render() {
    const { footerLabel, counterLabel } = this.state;
    return (
      <div>
        <h1>Hello World</h1>
        <Counter label={counterLabel} />
        <button
          onClick={() => {
            this.setState({ counterLabel: "add 1" });
          }}
        >
          change
        </button>
        <Footer label={footerLabel} />
      </div>
    );
  }
}

SimpleReact.render(<App />, document.querySelector("#app"));
