const config = require('./config')
const dgram = require('dgram');
const client = dgram.createSocket('udp4');


class MessageSender {

  static createGenericMessage () {
    return {
      type: null,
      hub: null,
      status: null,
      senderUsername: null,
      content: null,
      date: new Date()
    }
  }

  constructor (messageEventManager, phonebook) {
    this._phonebook = phonebook
    this._messageEventManager = messageEventManager
    messageEventManager.setMessageSender(this)
    this._init ()
  }


  _sendMessageGeneric (msgObj, ip) {
    if (!(msgObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return
    }

    let that = this
    msgObj.senderUsername = this._phonebook.getMe().getUsername()
    msgObj.status = this._phonebook.getMe().getStatus()

    // serializing the message
    let msgStr = JSON.stringify(msgObj)

    client.send(msgStr, config.port, ip, (err) => {
      //console.log(err);
      //client.close();

    })
  }


  sendStandardMessageToUser (messageStr, recipientUsername) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.standardMessageToUser
    message.content = messageStr
    let recipientIp = this._phonebook.getIp(recipientUsername)
    this._sendMessageGeneric(recipientUsername, recipientIp)
    this._messageEventManager.processOutcomingPacketMessage(message, recipientUsername)
  }


  sendStandardMessageToToHub (messageStr, hubName) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.standardMessageToHub
    message.hub = hubName
    message.content = messageStr
    let contactIps = this._phonebook.getContactsIps()
    for (let i=0; i<contactIps.length; i++) {
      this._sendMessageGeneric(message, contactIps[i])
    }
    this._messageEventManager.processOutcomingPacketMessage(message, config.allContactsUsername)
  }


  sendJoiningMessage () {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.joining
    let broadcastIps = this._phonebook.getBroadcastIps()
    for (let i=0; i<broadcastIps.length; i++) {
      this._sendMessageGeneric(message, broadcastIps[i])
    }
    this._messageEventManager.processOutcomingPacketMessage(message, config.broadcastUsername)
  }


  sendJoiningReplyMessage (recipientUsername) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.joiningReply
    let recipientIp = this._phonebook.getIp(recipientUsername)
    this._sendMessageGeneric(message, recipientIp)
    this._messageEventManager.processOutcomingPacketMessage(message, recipientUsername)
  }


  sendPingAllMessage () {

  }

}

module.exports = MessageSender
