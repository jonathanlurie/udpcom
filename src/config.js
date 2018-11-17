const config = {
  // This port is chosen arbitrarilly
  port : 21435,

  // When the event for sending a broacast message needs a recipient name
  broadcastUsername: '_BROADCAST_',

  // When the event for sending a message to all the contact needs a username
  allContactsUsername: '_ALL_CONTACTS_'

  messageTypes: {

    // the standard message from one user to the other
    standardMessageToUser: 'standardMessageToUser',

    // the standard message from one user to a hub (aka. a group, a channel)
    standardMessageToHub: 'standardMessageToHub',

    // broadcast message sent autmatically when a user connects, to let know the
    // other of his ip and username (other can add him to their phonebook)
    joining: 'joining',

    // automatic message sent back to a 'joining', from each already connected
    // user to newly connected user. The newly connected user can add the others
    // to his phonebook
    joiningReply: 'joiningReply',

    // message sent automatically every few seconds from every user to
    // every user, to let the others know that they are still connected.
    // It is also used to update phonebooks, in case IP of a user is changed, or status
    pingAll: 'pingAll'
  }
}

module.exports = config
