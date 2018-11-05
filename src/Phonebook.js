

class Phonebook {
  constructor (myUsername) {
    this._myUsername = myUsername
    this._myIp = null
    this._myUsername = null
    this._entries = {}
  }


  getMyUsername () {
    return this._myUsername
  }


  getIp (username) {
    if (username in this._entries) {
      return this._entries[username]
    } else {
      return null
    }
  }


  addEntry (ip, username) {
    this._entries[username] = ip
  }


  removeEntry (username) {
    if (username in this._entries) {
      delete this._entries[username]
    }
  }


  getAllUsernames () {
    return Object.keys(this._entries)
  }

}


module.exports = Phonebook
