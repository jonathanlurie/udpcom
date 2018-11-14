const os = require('os')

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
        allTheValid.push({name: networkName,ip: group.address, mask: group.netmask})
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

module.exports = {
  ipv4: ipv4,
  getBroadcastIpList: getBroadcastIpList
}
