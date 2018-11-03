const b64ab = require('base64-arraybuffer')
const CodecUtils = require('codecutils').CodecUtils
const dgram = require('dgram');
const server = dgram.createSocket('udp4');




server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});


server.on('message', (buffMsg, rinfo) => {

  if (buffMsg instanceof Buffer) {
    let packetMsg = CodecUtils.arrayBufferToUnicode(buffMsg.buffer)
    let packetObj = JSON.parse(packetMsg)
    packetObj.sendDatetime = new Date(packetObj.sendDatetime)
    console.log(packetObj)

  }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// server listening 0.0.0.0:41234
