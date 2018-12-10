const {ipv4, getBroadcastIpList, getIpListCidr} = require('./src/ip')

//let ipData = ipv4()[0]
//console.log(ipData);
// let ipList = getBroadcastIpList(ipData.ip, ipData.mask)
// console.log(ipList);

// 192.168.178.96 netmask 0xffffff00

getIpListCidr()
