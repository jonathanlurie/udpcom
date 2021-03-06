const config = require('./config')


/*
There can be various kinds of events, but this list is about associating one or
more callback function to each incoming of a message, upons its type. In other
words, this class a tool to defin what kind of actions are performed when a
message of a specific type is received.
Here it the list of all the incoming message types:
- `"standardMessageToUser"`: is just a message written by a user to another one.
- `"joining"`: is a message broadcasted automatically when a user connects. Such message is empty of content and is sent so that other users get notified of the precence of a new user. Then every other user can add the new user to their phonebook
- `"joiningReply"`: is the message sent back automatically as an answer to a `"joining"` message. Then, the newly connected user is notified of who is already connected, and can add every other user to its phonebook.


*/


class MessageEventManager {
  constructor (phonebook) {
    this._phonebook = phonebook
    this._messageSender = null
    this._messageReceiver = null
    this._sendMessageEvents = {}
    this._receiveMessageEvents = {}
    //this._init()
  }

  init () {
    let that = this
    // create empty arrays of events per type of message received
    let types = Object.values(config.messageTypes)
    for (let i=0; i<types.length; i++) {
      this._sendMessageEvents[types[i]] = []
      this._receiveMessageEvents[types[i]] = []
    }

    // adding some default events

    // When we receive a message with the status 'joining'
    this.onReceive(config.messageTypes.joining, function(packetObj, remoteInfo){
        // 1. add this person to the phonebook
        that._phonebook.addContact(remoteInfo.address, packetObj.senderUserId, packetObj.senderDisplayName, packetObj.status)
        // 2. make an auto reply to of type 'joiningReply' to be added to his phonebook
        that._messageSender.sendJoiningReplyMessage(packetObj.senderUserId)
      }
    )

    // When we receive a message with the status 'joiningReply'
    this.onReceive(config.messageTypes.joiningReply, function(packetObj, remoteInfo){
        // 1. add this person to the phonebook
        that._phonebook.addContact(remoteInfo.address, packetObj.senderUserId, packetObj.senderDisplayName, packetObj.status)
      }
    )

    // When we receive a message with the status 'pingAll'
    this.onReceive(config.messageTypes.pingAll, function(packetObj, remoteInfo){
        // 1. update this contact info if needed
        that._phonebook.resolveAndUpdate(packetObj.senderUserId, packetObj.senderDisplayName, remoteInfo.address, packetObj.status)
        // 2. update the last activity date
        that._phonebook.updateContactLastActivityDate(packetObj.senderUserId)
      }
    )

    // when we receive a standard message to a user
    // (most likely there will be another event added by the developer)
    this.onReceive(config.messageTypes.standardMessageToUser, function(packetObj, remoteInfo){
        // 1. update the last activity date
        that._phonebook.updateContactLastActivityDate(packetObj.senderUserId)
      }
    )

    // when we receive a standard message to a hub
    // (most likely there will be another event added by the developer)
    this.onReceive(config.messageTypes.standardMessageToHub, function(packetObj, remoteInfo){
        // 1. update the last activity date
        that._phonebook.updateContactLastActivityDate(packetObj.senderUserId)
      }
    )

  }


  /**
   * Add a callback to an event. Event must be one of config.messageTypes
   * Every event is called with the following arguments:
   * - @param {Object} packetObj - the received message object
   * - @param {Object} remoteInfo - the info about the sender
   */
  onReceive(messageEvent, cb) {
    if (!(messageEvent in config.messageTypes)) {
      console.warn('Event of type ' + messageEvent + ' does not exist. Callback not added.')
      return
    }

    if (typeof cb !== 'function') {
      console.warn('The callback function must be of type function. Callback not added.')
      return
    }

    this._receiveMessageEvents[messageEvent].push(cb)
  }


  /**
   * Add a callback to an event. Event must be one of config.messageTypes
   * If a broadcast message is sent (aka. multiple messages at once), still only
   * a single event is triggered.
   * Every event is called with the following arguments:
   * - @param {Object} packetObj - the received message object
   * - @param {String} recipientUsername - the username of the recipient
   */
  onSend(messageEvent, cb) {
    if (!(messageEvent in config.messageTypes)) {
      console.warn('Event of type ' + messageEvent + ' does not exist. Callback not added.')
      return
    }

    if (typeof cb !== 'function') {
      console.warn('The callback function must be of type function. Callback not added.')
      return
    }

    this._sendMessageEvents[messageEvent].push(cb)
  }


  _triggerReceiveMessageEvent (messageEvent, args) {
    let events = this._receiveMessageEvents[messageEvent]
    for (let i=0; i<events.length; i++) {
      events[i](...args)
    }
  }


  _triggerSendMessageEvent (messageEvent, args) {
    let events = this._sendMessageEvents[messageEvent]
    for (let i=0; i<events.length; i++) {
      events[i](...args)
    }
  }

  setMessageSender (ms) {
    this._messageSender = ms
  }

  setMessageReceiver (mr) {
    this._messageReceiver  = mr
  }

  processIncomingPacketMessage (packetObj, remoteInfo) {
    // the message must have a known type
    if (!(packetObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return
    }

    this._triggerReceiveMessageEvent(packetObj.type, [packetObj, remoteInfo])
  }


  processOutcomingPacketMessage (packetObj, recipientUsername) {
    // the message must have a known type
    if (!(packetObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return
    }

    this._triggerSendMessageEvent(packetObj.type, [packetObj, recipientUsername])
  }
}

module.exports = MessageEventManager
