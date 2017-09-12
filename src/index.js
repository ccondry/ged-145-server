const net = require('net')
const Ged145Request = require('./ged-145-request')
const messageHandlers = require('./message-handlers')

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
            const subtypeName = callData.callVars.SUBTYPE_TAG
            const subtype = this.subtypes[subtypeName]
            if (subtype) {
              // matching subtype found
              return await subtype.callback(callData)
            } else {
              // no matching subtype registered
              console.log('unmatched subtype ' + subtypeName)
              // try to return the error in common fields
              return {
                CDPD_TAG: 'Error unknown subtype'
                VAR10_TAG: 'Error unknown subtype'
              }
            }
          })
        } catch (e) {
          // unkown message type?
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

  // register a callback for subtype name
  on (subtype, callback) {
    this.subtypes[subtype] = {
      callback
    }
  }
}
