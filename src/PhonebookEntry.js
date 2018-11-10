

class PhonebookEntry {
  constructor (username, ip) {
    this._username = username
    this._ip = ip
    this._lastActivity = new Date()
  }

  getUsername () {
    return this._username
  }

  getIp () {
    return this._ip
  }

  getLastActivityDate () {
    return this._lastActivity
  }
}


module.exports = PhonebookEntry
