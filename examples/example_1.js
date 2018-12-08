const Udpcom = require('..')

let options = {
  //netmask: '255.0.0.0'
}

let udpcom = new Udpcom('jonathan.lurie', 'Jo', options)

let phonebook = udpcom.getPhonebook()
let messageSender = udpcom.getMessageSender()
let messageReceiver = udpcom.getMessageReceiver()
let messageEventManager = udpcom.getMessageEventManager()


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
