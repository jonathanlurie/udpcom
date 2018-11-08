const config = {
  // This port is chosen arbitrarilly
  port : 21435,


  messageTypes: {

    // the standard message from one user to the other
    standardMessage: 'standardMessage',

    // broadcast message sent autmatically when a user connects, to let know the
    // other of his ip and username (other can add him to their phonebook)
    joining: 'joining',

    // automatic message sent back to a 'joining', from each already connected
    // user to newly connected user. The newly connected user can add the others
    // to his phonebook
    joiningReply: 'joiningReply',

    // broadcast message sent automatically every few seconds from every user to
    // every user, to let the others know that they are still connected.
    // It is also used to update phonebooks, in case IP of a user is changed
    broadcastPing: 'broadcastPing'
  }
}

module.exports = config
