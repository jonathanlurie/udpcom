const config = require('./config')
const dgram = require('dgram');
const client = dgram.createSocket('udp4');


class MessageSender {

  static createGenericMessage () {
    return {
      type: null,
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


  _sendMessageGeneric (msgObj, ip) {
    if (!ip) {
      console.warn('The IP is null')
      return
    }

    if (!(msgObj.type in config.messageTypes)) {
      console.warn('The type of message is invalid')
      return
    }

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

    let recipientIp = this._phonebook.getIp(recipientUsername)
    this._sendMessageGeneric(message, recipientIp)
  }

  // TODO: the broadcast, how do we get the IP mask and where to iplement that?

}

module.exports = MessageSender
