

class PhonebookEntry {
  constructor (username, ip, status = null) {
    this._username = username
    this._status = status
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

  getStatus () {
    return this._status
  }

  setStatus (status) {
    this._status = status
  }

  updateLastActivityDate () {
    this._lastActivity = new Date()
  }

  setIp (ip) {
    this._ip = ip
  }

  setUsername (username) {
    this._username = username
  }
}


module.exports = PhonebookEntry
