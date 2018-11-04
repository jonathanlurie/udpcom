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

  }

  hello () {
    console.log('hello')
  }

  processIncomingPacketMessage (packetObj) {

  }
}

module.exports = MessageEventManager
