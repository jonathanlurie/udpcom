// require('dns').lookup(require('os').hostname(), function (err, add, fam) {
//   console.log('addr: '+add);
//   console.log(fam);
// })
//
//
// var os = require( 'os' );
//
// var networkInterfaces = os.networkInterfaces( );
//
// console.log( networkInterfaces );


// var ip = require("ip");
// console.log ( ip.address() );

const MessageReceiver = require('./MessageReceiver')
const IncomingMessageEventManager = require('./IncomingMessageEventManager')

let incomingMessageEventManager = new IncomingMessageEventManager()
let messageReceiver = new MessageReceiver( incomingMessageEventManager )
