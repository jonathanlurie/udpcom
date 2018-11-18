

class PhonebookEntry {
  constructor (id, displayName, ip, status = null) {
    this._id = id
    this._displayName = displayName
    this._status = status
    this._ip = ip
    this._lastActivity = new Date()
  }

  getDisplayName () {
    return this._displayName
  }

  getId () {
    return this._id
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

  setUserId (uid) {
    this._id = uid
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

  setDisplayName (displayName) {
    this._displayName = displayName
  }
}


module.exports = PhonebookEntry
