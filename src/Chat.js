import React, { Component } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const URL = 'wss://wssproxy.herokuapp.com/'

let localName = (localStorage.getItem('name')) ? localStorage.getItem('name') : 'Anonymous';

class Chat extends Component {
  state = {
    name: localName,
    messages: [],
  }

  ws = new WebSocket(URL)

  componentDidMount() {
    this.ws.onopen = (data) => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
      console.log(data)
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: message.concat(state.messages) }))

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { from: this.state.name, message: messageString }
    this.ws.send(JSON.stringify(message))
  }

  render() {
    return (
      <div>
        <div className="messagesContainer">
          {this.state.messages.map((message, index) =>
            <ChatMessage
              key={index}
              message={message.message}
              name={message.from}
              time={message.time}
            />,
          )}
          <div className="scrollerTo"></div>
        </div>
        <div className="senderContainer">
          <label htmlFor="name"
            className="chatSender"
            >
            Name:&nbsp;
            <input
              type="text"
              id={'name'}
              placeholder={'Enter your name...'}
              value={this.state.name}
              onChange={e => {  localStorage.setItem('name', e.target.value);
                this.setState({ name: e.target.value });}}
            />
          </label>
          <ChatInput
            ws={this.ws}
            onSubmitMessage={messageString => this.submitMessage(messageString)}
            className="chatSend"
          />
        </div>
      </div>
    )
  }
}

export default Chat
