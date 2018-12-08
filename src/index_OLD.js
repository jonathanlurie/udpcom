
const MessageReceiver = require('./MessageReceiver')
const MessageSender = require('./MessageSender')
const MessageEventManager = require('./MessageEventManager')
const Phonebook = require('./Phonebook')

// not sure this oneis very useful after all, i'll just replace that by an event
//const MessageThreadCollection = require('./MessageThreadCollection')

let phonebook = new Phonebook('jonathan.lurie2', 'jonathan2')
let messageEventManager = new MessageEventManager(phonebook)
let messageSender = new MessageSender( messageEventManager, phonebook)

let messageReceiver = new MessageReceiver(
  messageEventManager,
  phonebook,
  function(){
    console.log('Reading for incoming messages...');
  })

messageEventManager.init()

// tell to everyone we are connected
messageSender.sendJoiningMessage()

console.log(phonebook);
console.log(messageEventManager);
console.log(messageSender);
console.log(messageReceiver);

// do something when receiving a standard message to self
messageEventManager.onReceive('standardMessageToUser', function(packetObj, remoteInfo){
  console.log(`📥 from ${packetObj.senderDisplayName} (${packetObj.date.toString()})`)
  console.log(packetObj.content)
  console.log('____________________________________________________________')
})

// do something when receiving a standard message to a hub
messageEventManager.onReceive('standardMessageToHub', function(packetObj, remoteInfo){
  console.log(`📥 to hub #${packetObj.hub} from ${packetObj.senderDisplayName} (${packetObj.date.toString()})`)
  console.log(packetObj.content)
  console.log('____________________________________________________________')
})


// do something when sending a standard message to another user
messageEventManager.onSend('standardMessageToUser', function(packetObj, recipientUsername){
  console.log(`📤 sent to ${recipientUsername}`)
})

// do something when sending a standard message to a hub
messageEventManager.onSend('standardMessageToHub', function(packetObj, recipientUsername){ // here the name is _ALL_CONTACTS_
  console.log(`📤 sent to hub ${packetObj.hub}`)
})


// PHONEBOOK EVENTS ------------------------------------------------------------

phonebook.on('contactAdded', function(contactEntry){
  // contactEntry is of type PhonebookEntry
})

phonebook.on('contactRemoved', function(contactEntry){
  // contactEntry is of type PhonebookEntry
})

phonebook.on('contactIpUpdated', function(contactEntry){
  // contactEntry is of type PhonebookEntry
})

phonebook.on('contactStatusUpdated', function(contactEntry){
  // contactEntry is of type PhonebookEntry
})

phonebook.on('contactDisplaynameUpdated', function(data){
  // data is of shape {contact: PhonebookEntry, formerUsername: String}
})


phonebook.on('contactLastActivityDateUpdated', function(contactEntry){
  // contactEntry is of type PhonebookEntry
})

phonebook.on('myDataUploaded', function(contactEntry){
  // contactEntry is of type PhonebookEntry. They are my own
})
