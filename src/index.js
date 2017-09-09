const net = require('net')
const Ged145Request = require('src/ged-145-request')
const messageHandlers = require('src/message-handlers')

var server = net.createServer(function(socket) {
  console.log('connection received from ' + socket.remoteAddress + ":" + socket.remotePort)
  socket.on('data', function(data){
    // console.log('requestData hex:', data.toString('hex'))
    // console.log('requestData string:', data.toString('ascii'))
    const req = new Ged145Request(data)
    const messageHandler = messageHandlers[req.messageType]
    try {
      messageHandler(socket, req.messageBody)
    } catch (e) {
      console.log(e)
      console.log('req.messageType', req.messageType)
      // continue
    }
  })
})

server.listen(3006, '127.0.0.1')
