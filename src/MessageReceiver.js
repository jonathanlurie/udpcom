
const config = require('./config')
const CodecUtils = require('codecutils').CodecUtils
const dgram = require('dgram');
const server = dgram.createSocket('udp4');


class MessageReceiver {
  constructor ( messageEventManager, phonebook, onReady ) {
    this._phonebook = phonebook
    this._messageEventManager = messageEventManager
    messageEventManager.setMessageReceiver(this)
    this._init ()

    this._onReady = onReady
  }

  _init () {
    let that = this
    server.bind(config.port)

    server.on('error', (err) => {
      console.log(`server error:\n${err.stack}`)
      server.close()
    });

    server.on('message', (buffMsg, rinfo) => {
      if (buffMsg instanceof Buffer) {
        let packetMsg = CodecUtils.arrayBufferToUnicode(buffMsg.buffer)
        let packetObj = JSON.parse(packetMsg)
        packetObj.sendDatetime = new Date(packetObj.sendDatetime)
        that_messageEventManager.processIncomingPacketMessage(packetObj, rinfo)
      }
    })

    server.on('listening', () => {
      const address = server.address()
      console.log(`server listening ${address.address}:${address.port}`)
      that._onReady()
    })
  }
}



module.exports = MessageReceiver
