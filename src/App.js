import React, { Component } from "react";
import Amplify from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import logo from "./logo.svg";
import "./App.css";
import {
  IDENTITY_POOL_ID,
  REGION,
  USER_POOL_ID,
  USER_POOL_WEB_CLIENT_ID,
} from "./env.js";

Amplify.configure({
  Auth: {
    identityPoolId: IDENTITY_POOL_ID, //REQUIRED - Amazon Cognito Identity Pool ID
    region: REGION, // REQUIRED - Amazon Cognito Region
    userPoolId: USER_POOL_ID, //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: USER_POOL_WEB_CLIENT_ID, //OPTIONAL - Amazon Cognito Web Client ID
  },
});

const accesstoken =
  localStorage[
    Object.keys(localStorage).find(
      key =>
        key.includes(USER_POOL_WEB_CLIENT_ID) && key.includes("accessToken"),
    )
  ];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "bob",
      group: "",
    };
  }
  componentDidMount() {
    fetch("http://localhost:3000/api/v1/group", {
      headers: new Headers({
        accesstoken,
      }),
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {
        console.log("Success:", response);
      });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Dashboard
            items={[
              { title: "milk", selected: true },
              { title: "honey", selected: false },
              { title: "gas", selected: true },
            ]}
            wishes={[
              { title: "maid", selected: false },
              { title: "love", selected: false },
            ]}
          />
        </div>
        <GroupForm />
        <AddItemForm />
      </div>
    );
  }
}

export default withAuthenticator(App);

class GroupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { groupName: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { groupName } = this.state;

    fetch("http://localhost:3000/api/v1/groups", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({ groupName }),
      headers: new Headers({
        "Content-Type": "application/json",
        accesstoken,
      }),
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", response));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Group Name:
          <input
            type="text"
            name="groupName"
            value={this.state.groupName}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class AddItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { itemName: "", quantity: 0 };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { itemName, quantity } = this.state;

    fetch("http://localhost:3000/api/v1/items", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({ itemName, quantity }),
      headers: new Headers({
        "Content-Type": "application/json",
        accesstoken,
      }),
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", response));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Quantity:
          <input
            type="text"
            name="quantity"
            value={this.state.quantity}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Item Name:
          <input
            type="text"
            name="itemName"
            value={this.state.itemName}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const Item = ({ title, taken }) => (
  <div>
    <h1 style={{ background: taken ? "red" : "blue" }}>{title}</h1>
  </div>
);

const List = ({ items }) => (
  <ul>
    {items.map(item => (
      <li key={item.title}>
        <Item title={item.title} taken={item.taken || false} />
      </li>
    ))}
  </ul>
);

class Dashboard extends Component {
  render() {
    const { items, wishes } = this.props;

    return (
      <div style={{ display: "flex" }}>
        <List items={items} />
        <List items={wishes} />
      </div>
    );
  }
}
