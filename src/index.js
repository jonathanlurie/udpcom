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
//let msgThreadCollection = new MessageThreadCollection()
let messageEventManager = new MessageEventManager(phonebook)
let messageSender = new MessageSender( messageEventManager, phonebook)
let messageReceiver = new MessageReceiver(
  messageEventManager,
  phonebook,
  function(){
    // do something when the messageReceiver listens...
  })


// TODO: make all that a function that can be exposed, or an object with helper functions
