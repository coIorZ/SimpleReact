import SimpleReact from './simpleReact';

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
      count: 0,
    };
    console.log('Counter constructor');
  }

  componentWillMount() {
    console.log('Counter componentWillMount');
  }

  componentDidMount() {
    console.log('>>> didmount count', this.state.count);
    this.setState({ count: 1 });
    console.log('>>> didmount count', this.state.count);
    this.setState({ count: 2 });
    console.log('>>> didmount count', this.state.count);
    console.log('Counter componentDidMount');
  }

  componentDidUpdate() {
    console.log('Counter componentDidUpdate');
    console.log('>>> didupdate count', this.state.count);
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
      term: '',
    };
    this._guid = 0;
    console.log('Todolist constructor');
  }

  componentWillMount() {
    console.log('Todolist componentWillMount');
  }

  componentDidMount() {
    console.log('Todolist componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Todolist componentDidUpdate');
  }

  render() {
    const { todos, term } = this.state;
    return (
      <div>
        <input
          type="text"
          value={term}
          onChange={e => {
            this.setState({ term: e.target.value });
          }}
        />
        <button
          onClick={() => {
            const newTodos = todos.concat({ key: this._guid++, text: term });
            this.setState({ todos: newTodos, term: '' });
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

class KeyChild extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
    };
    console.log('KeyChild constructor');
  }

  componentDidMount() {
    console.log('KeyChild componentDidMount');
  }

  componentDidUpdate() {
    console.log('KeyChild componentDidUpdate');
  }

  componentWillUnmount() {
    console.log('KeyChild componentWillUnmount');
  }

  render() {
    const { name } = this.state;
    return <div>{name}</div>;
  }
}

class KeyParent extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'a',
    };
  }

  render() {
    const { name } = this.state;
    return (
      <div>
        <button
          onClick={() => {
            this.setState({ name: 'b' });
          }}
        >
          b
        </button>
        <KeyChild key={name} name={name} />
      </div>
    );
  }
}

class App extends SimpleReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      footerLabel: 'by SimpleReact',
      counterLabel: 'add',
    };
    console.log('App constructor');
  }

  componentWillMount() {
    console.log('App componentWillMount');
  }

  componentDidMount() {
    console.log('App componentDidMount');
    setTimeout(() => {
      this.setState({ counterLabel: 'add 1' });
    }, 2000);
  }

  componentDidUpdate() {
    console.log('App componentDidUpdate');
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
        <Section>
          <KeyParent />
        </Section>
        <Footer label={footerLabel} />
      </div>
    );
  }
}

SimpleReact.render(<App />, document.querySelector('#app'));
