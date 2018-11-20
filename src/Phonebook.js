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
  constructor (selfId, selfDisplayName) {
    this._me = new PhonebookEntry(selfId, selfDisplayName, null)
    this._contacts = {}

    this._events = {
      contactAdded: null,
      contactRemoved: null,
      contactIpUpdated: null,
      contactStatusUpdated: null,
      contactDisplaynameUpdated: null,
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


  updateMyDisplayName (displayName) {
    this._me.setDisplayName(displayName)
    this._events.myDataUploaded(this._me)
  }


  updateMyStatus (status) {
    this._me.setStatus(status)
    this._events.myDataUploaded(this._me)
  }


  getIp (userId) {
    if (userId in this._contacts) {
      return this._contacts[userId].getIp()
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


  addContact (ip, userId, displayName, status=null) {
    if (userId !== this._me.getId()) {
      this._contacts[userId] = new PhonebookEntry(userId, displayName, ip, status)
      this._events.contactAdded(this._contacts[userId])
    }
  }


  removeContact (userId) {
    if (userId in this._contacts) {
      let removedContact = this._contacts[userId]
      delete this._contacts[userId]
      this._events.contactRemoved(removedContact)
    }
  }


  getAllUserIds () {
    return Object.keys(this._contacts)
  }


  updateContactIp (userId, newIp) {
    if (userId in this._contacts) {
      this._contacts[userId].setIp(ip)
      this._events.contactIpUpdated(this._contacts[userId])
    }
  }


  updateContactLastActivityDate (userId) {
    if (userId in this._contacts) {
      this._contacts[userId].updateLastActivityDate()
      this._events.contactIpUpdated(this._contacts[userId])
    }
  }


  updateContactStatus (userId, status) {
    if (userId in this._contacts) {
      this._contacts[userId].setStatus(status)
      this._events.contactStatusUpdated(this._contacts[userId])
    }
  }


  updateContactDisplayName (userId, displayName) {
    if (userId in this._contacts) {
      this._contacts[userId].setDisplayName(displayName)
      this._events.contactDisplaynameUpdated(this._contacts[userId])
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
  hasSuchContact (userId, ip=null) {
    if (userId in this._contacts) {
      if (this._contacts[userId].getIp() === ip) {
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


  getContactsIps() {
    let ips = this._getAllContacts().map(function(c){return c.getIp()})
    return ips
  }


  /**
   * Usually called when a user receives a 'pingAll' message, to figure out if
   * a username, ip or status was updated
   */
  resolveAndUpdate (userId, displayName, ip, status) {
    // check if userId exist
    if (userId in this._contacts) {
      let theContact = this._contacts[userId]

      // update ip if needed
      if (theContact.getIp() !== ip) {
        // this way, we also call the event
        this.updateContactIp(userId, ip)
      }

      // update status if needed
      if (theContact.getStatus() !== status) {
        // this way, we also call the event
        this.updateContactStatus(userId, status)
      }

      // update displayName if needed
      if (theContact.getDisplayName()!== displayName) {
        // this way, we also call the event
        this.updateContactDisplayName(userId, displayName)
      }
    }
  }
}


module.exports = Phonebook
