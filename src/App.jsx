import React, { Component } from 'react';
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previousUser: { name: '' },
      currentUser: { name: 'Default' },
      messages: [],
      numOfUsers: 0
    };
    this.addMessage = this.addMessage.bind(this);
    this._handleSocketMessage = this._handleSocketMessage.bind(this);
    this.setUser = this.setUser.bind(this);
  }
  componentDidMount() {
    // Setup WebSocket Client
    console.log('componentDidMount <App />');
    this.socket = new WebSocket('ws://localhost:3001');
    // Add Event Listener for Open Connection
    this.socket.addEventListener('open', event => {
      console.log('connection opened with websocket server');
    });
    this.socket.onmessage = this._handleSocketMessage;
  }
  setUser(newUser) {
    this.setState(
      { previousUser: { name: this.state.currentUser.name } },
      () => {
        this.setState({ currentUser: { name: newUser } }, () => {
          let userChanged = {
            type: 'userChanged',
            content: {
              previousUser: this.state.previousUser.name,
              currentUser: newUser || this.state.previousUser.name
            }
          };
          if (this.state.previousUser.name !== newUser)
            this.socket.send(JSON.stringify(userChanged));
        });
      }
    );
  }
  addMessage(username, content) {
    if (!content) {
      console.log('no content');
    } else {
      console.log('Username: ' + username);
      console.log('Message: ' + content);
      let newMessage = {
        type: 'newMessage',
        content: {
          username: username,
          content: content
        }
      };
      this.socket.send(JSON.stringify(newMessage));
    }
  }

  // RENDER STARTS HERE
  render() {
    return (
      <div>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            Chatty
          </a>
          <div className="userCount">
            Number of users logged-in: {this.state.numOfUsers}
          </div>
        </nav>
        <MessageList messages={this.state.messages} />
        <ChatBar
          currentUser={this.state.currentUser}
          addMessage={this.addMessage}
          setUser={this.setUser}
        />
      </div>
    );
  }
  // RENDER ENDS HERE

  _handleSocketMessage(message) {
    let messageData = JSON.parse(message.data);
    console.log(messageData);
    switch (messageData.type) {
      case 'newMessage':
        console.log(messageData);
        console.log(
          'recieved the following from WebSocketServer:',
          message.data
        );
        let messages = [...this.state.messages, messageData];
        // Update the state of the app component.
        // Calling setState will trigger a call to render() in App and all child components.
        this.setState({ messages }, () => {
          console.log(this.state.messages);
        });
        break;
      case 'userChanged':
        console.log(`we're here`);
        let oldUser = messageData.previousUser;
        let newUser = messageData.newUser;
        let userMessages = [
          ...this.state.messages,
          { content: `${oldUser} is now ${newUser}` }
        ];
        // Update the state of the app component.
        // Calling setState will trigger a call to render() in App and all child components.
        this.setState({ messages: userMessages }, () => {
          console.log(this.state.messages);
        });
        break;
      case 'numUsers':
        this.setState({ numOfUsers: messageData.content });
        break;
      default:
        console.log(`invalid message type ${message}`);
    }
  }
}
export default App;
