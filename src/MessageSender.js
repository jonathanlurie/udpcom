const config = require('./config')
const dgram = require('dgram');
const client = dgram.createSocket('udp4');


class MessageSender {

  static createGenericMessage () {
    return {
      type: null,
      hub: null,
      status: null,
      username: null,
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


  _sendMessageGeneric (msgObj, recipientUsername) {
    let ip = this._phonebook.getIp(recipientUsername)

    if (!ip) {
      console.warn('No IP for this username')
      return
    }

    if (!(msgObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return
    }

    let that = this
    msgObj.username = this._phonebook.getMyUsername()

    // serializing the message
    let msgStr = JSON.stringify(msgObj)

    client.send(msgStr, config.port, ip, (err) => {
      //console.log(err);
      //client.close();

    })
  }


  sendStandardMessage (messageStr, recipientUsername) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.standardMessage
    message.content = messageStr
    this._sendMessageGeneric(recipientUsername, recipientIp)
    this._messageEventManager.processOutcomingPacketMessage(message, recipientUsername)
  }


  sendJoiningReplyMessage (recipientUsername) {
    let message = MessageSender.createGenericMessage()
    message.type = config.messageTypes.joiningReply
    this._sendMessageGeneric(message, recipientUsername)
    this._messageEventManager.processOutcomingPacketMessage(message, recipientUsername)
  }

  // TODO: the broadcast, how do we get the IP mask and where to iplement that?
  // the broadcast ping also goes with the status update
}

module.exports = MessageSender
