const PhonebookEntry = require('./PhonebookEntry')
const {ipv4, getBroadcastIpList} = require('./ip')
const config = require('./config')

/*
  Events, set with .on('eventName', function(phoneBkEntry){...})
  Only one callback function per event:
  - 'contactAdded'
  - 'contactRemoved'
  - 'contactIpUpdated'
  - 'contactStatusUpdated'

*/

class Phonebook {
  constructor () {
    this._me = new PhonebookEntry(config.undefinedUsername, null)
    this._contacts = {}

    this._events = {
      contactAdded: null,
      contactRemoved: null,
      contactIpUpdated: null,
      contactStatusUpdated: null,
      contactUsernameUpdated: null,
      contactLastActivityDateUpdated: null,
      myDataUploaded: null
    }

    // compute all the IP for a broadcast message
    let ipData = ipv4()[0]
    this._broadcastIps = getBroadcastIpList(ipData.ip, ipData.mask)

  }

  _getAllContacts () {
    let that = this
    return Object.keys(this._contacts).map(function(c){return that._contacts[c]})
  }

  getMe () {
    return this._me
  }


  updateMyUsername (username) {
    this._me.setUsername(username)
    this._events.myDataUploaded(this._me)
  }


  updateMyStatus (status) {
    this._me.setStatus(status)
    this._events.myDataUploaded(this._me)
  }


  getIp (username) {
    if (username in this._contacts) {
      return this._contacts[username].getIp()
    } else {
      return null
    }
  }


  /**
   * Get all the IP for a braodcast, using the local IP and netmask
   */
  getBroadcastIps () {
    return this._broadcastIps
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


  updateContactLastActivityDate (username) {
    if (username in this._contacts) {
      this._contacts[username].updateLastActivityDate()
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
    let allContacts = this._getAllContacts()

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
      let formerUsername = contact.getUsername()
      contact.setUsername(newUsername)
      this.removeContact(formerUsername)
      this.events.contactUsernameUpdated({contact: contact, formerUsername:formerUsername})
    }
    return contact
  }


  getContactsIps() {
    let ips = this._getAllContacts().map(function(c){return c.getIp()})
    return ips
  }


  /**
   * Usually called when a user receives a 'pingAll' message, to figure out if
   * a username, ip or status was updated
   */
  resolveAndUpdate (username, ip, status) {
    // 1. check if username exist
    if (username in this._contacts) {
      let theContact = this._contacts[username]

      if (theContact.getIp() !== ip) {
        // this way, we also call the event
        this.updateContactIp(username, ip)
      }

      if (theContact.getStatus() !== status) {
        // this way, we also call the event
        this.updateContactStatus(username, status)
      }
    } else {

      // 2. if we have a contact with such ip, if so, update the name
      let contact = this.updateContactUsername(ip, username)

      if (contact) {
        if (contact.getStatus() !== status) {
          this.this.updateContactStatus(contact.getUsername(), status)
        }
      } else {
        // a new contact must be created, but it's very unlikely that gets
        // created after a 'pingAll' message
        this.addContact(ip, username, status)
      }
    }
  }
}


module.exports = Phonebook
