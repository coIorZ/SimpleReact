import SimpleReact from "./simpleReact";

const Section = ({ children }) => (
  <div style="margin-top:20px;margin-bottom:20px;">{children}</div>
);

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

const Todo = ({ text, onRemove }) => (
  <li style="width:120px;">
    <span>{text}</span>
    <span style="color:red;float:right;cursor:pointer;" onClick={onRemove}>
      x
    </span>
  </li>
);

class TodoList extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      term: ""
    };
    this._guid = 0;
    console.log("constructor", props);
  }

  componentDidMount() {
    console.log("componentDidMount");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      "componentDidUpdate",
      prevProps,
      prevState,
      this._internalInstance
    );
  }

  render() {
    const { todos, term } = this.state;
    return (
      <div>
        <input
          type="text"
          value={term}
          onChange={e => {
            e.preventDefault();
            this.setState({ term: e.target.value });
          }}
        />
        <button
          onClick={() => {
            const newTodos = todos.concat({ key: this._guid++, text: term });
            this.setState({ todos: newTodos, term: "" });
          }}
        >
          submit
        </button>
        <ul>
          {todos.map(todo => (
            <Todo
              key={todo.key}
              text={todo.text}
              onRemove={() => {
                const newTodos = todos.filter(t => t.key !== todo.key);
                this.setState({ todos: newTodos });
              }}
            />
          ))}
          <li>todo</li>
        </ul>
      </div>
    );
  }
}

class App extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      footerLabel: "by SimpleReact",
      counterLabel: "add"
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ counterLabel: "add 1" });
    }, 2000);
  }

  render() {
    const { footerLabel, counterLabel } = this.state;
    return (
      <div>
        <Section>
          <Counter label={counterLabel} />
        </Section>
        <Section>
          <TodoList />
        </Section>
        <Footer label={footerLabel} />
      </div>
    );
  }
}

SimpleReact.render(<App />, document.querySelector("#app"));
