import SimpleReact from "./simpleReact";

const Footer = ({ children }) => (
  <div style="margin-top:50px;">
    <span>{children}</span>
  </div>
);

class Counter {
  render() {
    return <button onClick={() => alert("hi")}>button</button>;
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
