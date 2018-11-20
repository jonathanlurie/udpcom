const config = require('./config')
const dgram = require('dgram');
const client = dgram.createSocket('udp4');


class MessageSender {

  static createGenericMessage () {
    return {
      type: null,
      hub: null,
      status: null,
      senderUserId: null,
      senderDisplayName: null,
      content: null,
      date: new Date().toString()
    }
  }

  constructor (messageEventManager, phonebook) {
    this._phonebook = phonebook
    this._messageEventManager = messageEventManager
    messageEventManager.setMessageSender(this)
  }


  _sendMessageGeneric (msgObj, ip) {
    if (!(msgObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return false
    }

    if (!ip) {
      console.warn('The ip is not valid')
      return false
    }

    let that = this
    msgObj.senderUserId= this._phonebook.getMe().getId()
    msgObj.senderDisplayName= this._phonebook.getMe().getDisplayName()
    msgObj.status = this._phonebook.getMe().getStatus()

    // serializing the message
    let msgStr = JSON.stringify(msgObj)
    client.send(msgStr, config.port, ip, (err) => {})
    return true
  }


  sendStandardMessageToUser (messageStr, recipientUserId) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.standardMessageToUser
    message.content = messageStr
    let recipientIp = this._phonebook.getIp(recipientUserId)
    let ok = this._sendMessageGeneric(message, recipientIp)
    if (ok)
      this._messageEventManager.processOutcomingPacketMessage(message, recipientUserId)
  }


  sendStandardMessageToHub (messageStr, hubName) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.standardMessageToHub
    message.hub = hubName
    message.content = messageStr
    let contactIps = this._phonebook.getContactsIps()
    for (let i=0; i<contactIps.length; i++) {
      this._sendMessageGeneric(message, contactIps[i])
    }
    this._messageEventManager.processOutcomingPacketMessage(message, config.allContactsUserId)
  }


  sendJoiningMessage () {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.joining
    let broadcastIps = this._phonebook.getBroadcastIps()
    for (let i=0; i<broadcastIps.length; i++) {
      this._sendMessageGeneric(message, broadcastIps[i])
    }
    this._messageEventManager.processOutcomingPacketMessage(message, config.broadcastUserId)
  }


  sendJoiningReplyMessage (recipientUserId) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.joiningReply
    let recipientIp = this._phonebook.getIp(recipientUserId)
    this._sendMessageGeneric(message, recipientIp)
    this._messageEventManager.processOutcomingPacketMessage(message, recipientUserId)
  }


  sendPingAllMessage () {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.pingAll

    let contactIps = this._phonebook.getContactsIps()
    for (let i=0; i<contactIps.length; i++) {
      this._sendMessageGeneric(message, contactIps[i])
    }
    this._messageEventManager.processOutcomingPacketMessage(message, config.allContactsUserId)
  }

}

module.exports = MessageSender
