const MessageReceiver = require('./MessageReceiver')
const MessageSender = require('./MessageSender')
const MessageEventManager = require('./MessageEventManager')
const Phonebook = require('./Phonebook')


/**
 * options:
 *  options.cidr {string} - force a different cidr
 */
class Udpcom {
  constructor (userId, displayName, options) {
    this._phonebook = new Phonebook(userId, displayName, options)
    this._messageEventManager = new MessageEventManager(this._phonebook)
    this._messageSender = new MessageSender( this._messageEventManager, this._phonebook)

    this._messageReceiver = new MessageReceiver(
      this._messageEventManager,
      this._phonebook,
      function(){
        console.log('Reading for incoming messages...');
      })

    this._messageEventManager.init()

    console.time('broadcast')
    // tell to everyone we are connected
    this._messageSender.sendJoiningMessage()
    console.timeEnd('broadcast')
  }


  getPhonebook() {
    return this._phonebook
  }

  getMessageEventManager() {
    return this._messageEventManager
  }

  getMessageSender() {
    return this._messageSender
  }

  getMessageReceiver() {
    return this._messageReceiver
  }

}

module.exports = Udpcom
