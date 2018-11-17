// require('dns').lookup(require('os').hostname(), function (err, add, fam) {
//   console.log('addr: '+add);
//   console.log(fam);
// })
//
//
// var os = require( 'os' );
//
// var networkInterfaces = os.networkInterfaces( );
//
// console.log( networkInterfaces );


// var ip = require("ip");
// console.log ( ip.address() );

const MessageReceiver = require('./MessageReceiver')
const MessageSender = require('./MessageSender')
const MessageEventManager = require('./MessageEventManager')
const Phonebook = require('./Phonebook')

// not sure this oneis very useful after all, i'll just replace that by an event
//const MessageThreadCollection = require('./MessageThreadCollection')

let phonebook = new Phonebook("Jonathan")
let messageEventManager = new MessageEventManager(phonebook)
let messageSender = new MessageSender( messageEventManager, phonebook)

let messageReceiver = new MessageReceiver(
  messageEventManager,
  phonebook,
  function(){
    console.log('Reading for incoming messages...');
  })


// do something when receiving a standard message to self
messageEventManager.onReceive('standardMessageToUser', function(packetObj, remoteInfo){
  console.log(`📥 from ${packetObj.senderUsername} (${packetObj.toISOString()})`)
  console.log(packetObj.message)
  console.log('____________________________________________________________')
)

// do something when receiving a standard message to a hub
messageEventManager.onReceive('standardMessageToHub', function(packetObj, remoteInfo){
  console.log(`📥 to hub #${packetObj.hub} from ${packetObj.senderUsername} (${packetObj.toISOString()})`)
  console.log(packetObj.message)
  console.log('____________________________________________________________')
)


// do something when sending a standard message to another user
messageEventManager.onSend('standardMessageToUser', function(packetObj, recipientUsername){
  console.log(`📤 sent to ${recipentUsername}`)
)

// do something when sending a standard message to a hub
messageEventManager.onSend('standardMessageToHub', function(packetObj, recipientUsername){ // here the name is _ALL_CONTACTS_
  console.log(`📤 sent to hub ${packetObj.hub}`)
)
