
const b64ab = require('base64-arraybuffer')
const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// client.send("hello there", 41234, 'localhost', (err) => {
//   client.close();
// });



let dataMsg = new Uint8Array(1000)
for (let i=0; i<dataMsg.length; i++) {
  dataMsg[i] = i%255
}
let b64DataMsg = b64ab.encode(dataMsg.buffer)

//console.log(b64DataMsg);

let packetObj = {
  senderName: "Jonathan",
  sendDatetime: new Date(),
  message: "héllo, do you receive më? 🤖",
}

let packetMsg = JSON.stringify(packetObj)


client.send(packetMsg, 41234, 'localhost', (err) => {
  client.close();
});
