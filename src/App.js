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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "bob",
    };
  }
  componentDidMount() {}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <GroupForm />
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

    fetch("http://localhost:3001/foo", {
      method: "POST", // or 'PUT'
      body: { groupName },
      headers: new Headers({
        "Content-Type": "application/json",
        accesstoken:
          localStorage[
            Object.keys(localStorage).find(
              key =>
                key.includes(USER_POOL_WEB_CLIENT_ID) &&
                key.includes("accessToken"),
            )
          ],
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
