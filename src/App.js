import React, { Component } from "react";
// import Amplify, { API } from "aws-amplify";
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
  // Analytics: {
  //   appId: 'XXXXXXXXXXabcdefghij1234567890ab', //OPTIONAL -  Amazon Pinpoint App ID
  //   region: 'XX-XXXX-X', //OPTIONAL -  Amazon service region
  // }
  // API: {
  //   endpoints: [
  //     {
  //       name: "ApiName1",
  //       endpoint: "https://1234567890-abcdefgh.amazonaws.com",
  //     },
  //     {
  //       name: "ApiName2",
  //       endpoint: "https://1234567890-abcdefghijkl.amazonaws.com",
  //     },
  //   ],
  // },
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
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    // let apiName = "ApiName1";
    // let path = "/foo";
    // let myInit = {
    //   // OPTIONAL
    //   body: { foo: "bar" },
    //   headers: {}, // OPTIONAL
    // };
    // API.post(apiName, path, myInit).then(() => {
    //   console.log("post");
    // });

    const { groupName } = this.state;
    console.log({ groupName });
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
          Name:
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
