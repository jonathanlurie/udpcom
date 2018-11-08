const config = require('./config')


/*
There can be various kinds of events, but this list is about associating one or
more callback function to each incoming of a message, upons its type. In other
words, this class a tool to defin what kind of actions are performed when a
message of a specific type is received.
Here it the list of all the incoming message types:
- `"standardMessage"`: is just a message written by a user to another one.
- `"joining"`: is a message broadcasted automatically when a user connects. Such message is empty of content and is sent so that other users get notified of the precence of a new user. Then every other user can add the new user to their phonebook
- `"joiningReply"`: is the message sent back automatically as an answer to a `"joining"` message. Then, the newly connected user is notified of who is already connected, and can add every other user to its phonebook.


*/


class MessageEventManager {
  constructor () {
    this._messageSender = null
    this._messageReceiver = null
    this._receivedEvents = {}
    this._init()

    // TODO: allow addition of external events
  }

  _init () {
    let that = this
    // create empty arrays of events per type of message received
    let types = Object.values(config.messageTypes)
    for (let i=0; i<types.length; i++) {
      this._receivedEvents[types[i]] = []
    }

    // adding some default events

    // When we receive a message with the status 'joining', we:
    // 1. add this person to the phonebook
    // 2. make an auto reply to of type 'joiningWelcome' to be added to his phonebook
    this._receivedEvents[config.messageTypes.joining].push(
      function(packetObj, remoteInfo){
        // TODO
      }
    )
    // TODO: write the 2.

    // TODO: add event for when receive joining welcome (add it to the phonebook)

  }

  setMessageSender (ms) {
    this._messageSender = ms
  }

  setMessageReceiver (mr) {
    this._messageReceiver  = mr
  }

  processIncomingPacketMessage (packetObj, remoteInfo) {
    // the message must have a known type
    if (!(msgObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return
    }

    // TODO: call the right event
  }
}

module.exports = MessageEventManager
