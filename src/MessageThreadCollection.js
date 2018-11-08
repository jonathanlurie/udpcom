const config = require('./config')
const MessageThread = require('./MessageThread')

class MessageThreadCollection {
  constructor () {
    // threads of message that are user-to-user
    this._userMessageThreads = {}

    // threads of message that are user-to-hub
    this._hubMessageThreads = {}
  }


  addMessage (msgObj) {
    // the message has to be a 'standardMessage' to be added
    if (!('type' in msgObj && msgObj.type === config.messageTypes.standardMessage)) {
      return
    }

    // case 1: the message is user-to-user
    if (!msgObj.hub) {
      let fromUser = msgObj.username
      if (!(fromUser in this._userMessageThreads)) {
        this._userMessageThreads[fromUser] = new MessageThread(fromUser)
      }
      this._userMessageThreads[fromUser].addMessage(msgObj)
    }

    // case 2: the message is user-to-hub
    else {
      let hubName = msgObj.hub
      if (!(hubName in this._hubMessageThreads)) {
        this._hubMessageThreads[hubName] = new MessageThread(hubName)
      }
      this._hubMessageThreads[hubName].addMessage(msgObj)
    }
  }


  /**
   * Get the list of all the usernames that have already sent a user-to-user message
   */
  getUsernames () {
    return Object.key(this._userMessageThreads)
  }


  /**
   * Get the names of all the hubs that have already received a user-to-hub message
   */
  getHubnames () {
    return Object.key(this._hubMessageThreads)
  }


  getUserThread (fromUsername) {
    if (fromUsername in this._userMessageThreads) {
      return this._userMessageThreads[fromUsername]
    } else {
      return null
    }
  }


  getHubThread (hubname) {
    if (hubname in this._hubMessageThreads) {
      return this._hubMessageThreads[hubname]
    } else {
      return null
    }
  }

}

module.exports = MessageThreadCollection
