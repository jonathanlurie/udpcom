const os = require('os')
const CIDR = require('cidr-js')

function ipv4() {

  let networkInterfaces = os.networkInterfaces()
  let networkInterfacesKeys = Object.keys(networkInterfaces)
  let allTheValid = []

  for (let i=0; i<networkInterfacesKeys.length; i++) {
    let networkName = networkInterfacesKeys[i]
    let interf = networkInterfaces[networkName];

    for (let g=0; g<interf.length; g++) {
      let group = interf[g]
      if (!group.internal && group.family === 'IPv4') {
        allTheValid.push({name: networkName,ip: group.address, mask: group.netmask, cidr: group.cidr})
      }
    }

  }
  return allTheValid
}

function getBroadcastIpList(ip, mask) {
  let ipArray = ip.split('.').map(function(nb){return parseInt(nb)})
  let maskArray = mask.split('.').map(function(nb){return parseInt(nb)})

  let zero254 = []
  for (let i=1; i<255; i++) {
    zero254.push(i)
  }

  let ipElements = []

  for (let i=0; i<4; i++) {
    if(maskArray[i]) {
      ipElements[i] = [ipArray[i]]
    } else {
      ipElements[i] = zero254
    }
  }

  let allIps = []

  for (let a=0; a<ipElements[0].length; a++) {
    for (let b=0; b<ipElements[1].length; b++) {
      for (let c=0; c<ipElements[2].length; c++) {
        for (let d=0; d<ipElements[3].length; d++) {
          allIps.push(`${ipElements[0][a]}.${ipElements[1][b]}.${ipElements[2][c]}.${ipElements[3][d]}`)
        }
      }
    }
  }
  return allIps
}

// if cidr not provided, the the local ip/cidr is used (with the function ipv4() )
function getIpListCidr(cidrStr=null) {
  if(!cidrStr) {
    let ipData = ipv4()[0]
    cidrStr = ipData.cidr
  }

  let cidr = new CIDR()
  let results = cidr.list(cidrStr)
  return results
}

module.exports = {
  ipv4: ipv4,
  getBroadcastIpList: getBroadcastIpList,
  getIpListCidr:getIpListCidr
}
