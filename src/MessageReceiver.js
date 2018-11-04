
const config = require('./config')
const CodecUtils = require('codecutils').CodecUtils
const dgram = require('dgram');
const server = dgram.createSocket('udp4');


class MessageReceiver {
  constructor ( messageEventManager ) {
    this._messageEventManager = messageEventManager
    this._init ()
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
        that.processIncomingPacketMessage(packetObj)
      }
    })

    server.on('listening', () => {
      const address = server.address()
      console.log(`server listening ${address.address}:${address.port}`)
    })


  }
}



module.exports = MessageReceiver
