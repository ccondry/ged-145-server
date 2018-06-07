const net = require('net')
const Ged145Request = require('./ged-145-request')
const messageHandlers = require('./message-handlers')

module.exports = class {

  constructor (address, port) {
    this.address = address
    this.port = port
    this.subtypes = {}

    const server = net.createServer(socket => {
      // handle ECONNRESET
      socket.on("error", error => {
        console.log(`Connection reset by ${socket.remoteAddress}:${socket.remotePort}`)
        // console.log(error.stack)
      })

      console.log('connection received from ' + socket.remoteAddress + ":" + socket.remotePort)
      socket.on('data', data => {
        // console.log('requestData hex:', data.toString('hex'))
        // console.log('requestData string:', data.toString('ascii'))
        const req = new Ged145Request(data)
        const messageHandler = messageHandlers[req.messageType]
        try {
          messageHandler(socket, req.messageBody, callData => {
            // callback run during QUERY_REQ
            // console.log('callData received: ', callData)
            // try to run registered subtype callback
            const subtypeName = callData.callVars.SUBTYPE_TAG
            const subtype = this.subtypes[subtypeName]
            if (subtype) {
              // matching subtype found
              try {
                return subtype.callback(callData)
              } catch (e) {
                // failed to run registered callback
                console.error('ged-145-server encountered exception trying to run registered callback for subtype ' + subtype, e)
                try {
                  console.log('Returning error in CDPD_TAG')
                  return {
                    CDPD_TAG: 'Error - ' + e.toString()
                  }
                } catch (e2) {
                  console.log('failed to process error into string.')
                  console.log('Returning unknown error in CDPD_TAG.')
                  return {
                    CDPD_TAG: 'Error - unknown exception'
                  }
                }

              }
            } else {
              // no matching subtype registered
              console.log('unmatched subtype ' + subtypeName)
              // try to return the error in common fields
              return {
                CDPD_TAG: 'Error unknown subtype',
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
