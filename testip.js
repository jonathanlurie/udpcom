const {ipv4, getBroadcastIpList} = require('./src/ip')

let ipData = ipv4()[0]
console.log(ipData);
// let ipList = getBroadcastIpList(ipData.ip, ipData.mask)
// console.log(ipList);
