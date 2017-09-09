const net = require('net')
const Ged145Request = require('src/ged-145-request')
const messageHandlers = require('src/message-handlers')
const axios = require('axios')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const server = net.createServer(function(socket) {
  console.log('connection received from ' + socket.remoteAddress + ":" + socket.remotePort)
  socket.on('data', function(data){
    // console.log('requestData hex:', data.toString('hex'))
    // console.log('requestData string:', data.toString('ascii'))
    const req = new Ged145Request(data)
    const messageHandler = messageHandlers[req.messageType]
    try {
      messageHandler(socket, req.messageBody, async function (callData) {
        // callback run during QUERY_REQ
        console.log('callData received: ', callData)
        // TODO do something useful here
        switch (callData.callVars.SUBTYPE_TAG) {
          case 'ece.lookup': {
            console.log('this is ece.lookup subtype')
            try {
              const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
              // console.log(response)
              // await sleep(1300)
              // const response = {
              //   data: {
              //     userId: "1234ABCD"
              //   }
              // }
              const confirmation = response.data.userId
              return {
                VAR10_TAG: String(confirmation)
              }
            } catch (e) {
              return {
                VAR10_TAG: 'error'
              }
            }
          }
          default: {
            return {}
          }
        }
      })
    } catch (e) {
      console.log(e)
      console.log('req.messageType', req.messageType)
      // continue
    }
  })
})

server.listen(3006, '127.0.0.1')
