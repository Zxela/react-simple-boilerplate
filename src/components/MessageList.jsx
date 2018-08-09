import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);
  }

  renderMessage = () => {
    return this.props.messages.map((message, index) => {
      if (message.type === 'newMessage') {
        return (
          <div className="message" key={index}>
            <span className="message-username">{message.username}</span>
            <span className="message-content">{message.content}</span>
          </div>
        );
      } else {
        return (
          <div class="notification">
            <span
              class="notification-content"
              style={{ color: 'red', fontSize: '200%' }}
            >
              {message.content}
            </span>
          </div>
        );
      }
    });
  };

  render() {
    return <div>{this.renderMessage()}</div>;
  }
}
export default MessageList;
