

class MessageThread {

  /**
   * @param {String} threadName - most likely the name of the sender or the name of the hub/channel
   */
  constuctor (threadName) {
    this._name = threadName
    this._messages = []
  }


  addMessage (msgObj) {
    this._messages.push(msgObj)
  }


  getNumberOfMessages () {
    return this._messages.length
  }

  getMessageFromTo (from = 0, to = -1) {
    return this._messages.slice(from, to)
  }

}

module.exports = MessageThread
