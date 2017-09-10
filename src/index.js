const net = require('net')
const Ged145Request = require('./ged-145-request')
const messageHandlers = require('./message-handlers')
const axios = require('axios')

module.exports = class {

  constructor (address, port) {
    this.address = address
    this.port = port
    this.subtypes = {}

    const server = net.createServer(socket => {
      console.log('connection received from ' + socket.remoteAddress + ":" + socket.remotePort)
      socket.on('data', data => {
        // console.log('requestData hex:', data.toString('hex'))
        // console.log('requestData string:', data.toString('ascii'))
        const req = new Ged145Request(data)
        const messageHandler = messageHandlers[req.messageType]
        try {
          messageHandler(socket, req.messageBody, async callData => {
            // callback run during QUERY_REQ
            // console.log('callData received: ', callData)
            // try to run registered subtype callback
            return await this.subtypes[callData.callVars.SUBTYPE_TAG].callback(callData)
          })
        } catch (e) {
          console.log(e)
          console.log('req.messageType', req.messageType)
          // continue
        }
      })
    })
    this.server = server
  }

  start () {
    this.server.listen(this.port, this.address)
  }

  on (subtype, callback) {
    this.subtypes[subtype] = {
      callback
    }
  }
}
