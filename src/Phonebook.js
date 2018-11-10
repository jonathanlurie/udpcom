const PhonebookEntry = require('./PhonebookEntry')

/*
  Events, set with .on('eventName', function(phoneBkEntry){...})
  Only one callback function per event:
  - 'contactAdded'
  - 'contactRemoved'
  - 'contactIpUpdated'
  - 'contactStatusUpdated'

*/

class Phonebook {
  constructor (myUsername) {
    this._me = new PhonebookEntry(myUsername, null)
    this._contacts = {}

    this._events = {
      contactAdded: null,
      contactRemoved: null,
      contactIpUpdated: null,
      contactStatusUpdated: null,
      contactUsernameUpdated: null
    }
  }


  getMe () {
    return this._me
  }


  getIp (username) {
    if (username in this._contacts) {
      return this._contacts[username].getIp()
    } else {
      return null
    }
  }


  addContact (ip, username, status=null) {
    this._contacts[username] = new PhonebookEntry(username, ip, status)
    this._events.contactAdded(this._contacts[username])
  }


  removeContact (username) {
    if (username in this._contacts) {
      let removedContact = this._contacts[username]
      delete this._contacts[username]
      this._events.contactRemoved(removedContact)
    }
  }


  getAllUsernames () {
    return Object.keys(this._contacts)
  }


  updateContactIp (username, newIp) {
    if (username in this._contacts) {
      this._contacts[username].setIp(ip)
      this._events.contactIpUpdated(this._contacts[username])
    }
  }


  updateContactStatus (username, status) {
    if (username in this._contacts) {
      this._contacts[username].setStatus(status)
      this._events.contactStatusUpdated(this._contacts[username])
    }
  }


  on( eventName, cb) {
    if (!(eventName in this._events)) {
      console.warn('Such event is not possible.')
      return
    }

    if (typeof cb !== 'function') {
      console.warn('Callback must be of type function')
      return
    }

    this._events[eventName] = cb
  }


  // if ip is provided, perform a test on the é fields
  hasSuchContact (username, ip=null) {
    if (username in this._contacts) {
      if (this._contacts[username].getIp() === ip) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }


  getContactFromIp (ip) {
    let allContacts = Object.values(this._contacts)

    for (let i=0; i<allContacts.length; i++) {
      if(allContacts[i].getIp() === ip) {
        return allContacts[i]
      }
    }
    return null
  }

  updateContactUsername (ip, newUsername) {
    let contact = this.getContactFromIp(ip)

    if (contact) {
      let oldUsername = contact.getUsername()
      contact.setUsername(newUsername)
      this.removeContact(oldUsername)
      this.events.contactUsernameUpdated({contact: contact, oldUsername:oldUsername})
    }
  }


  getContactsIps() {
    let ips = Object.values(this._contacts).map(function(c){return c.getIp()})
    return ips
  }

}


module.exports = Phonebook
