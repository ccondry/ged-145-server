const heartbeatResponse = require('src/responses/heartbeat')

module.exports = function (socket, data) {
  // An ID for this message, which should be included in the response.
  const invokeId = data.readUInt32BE(0)
  // console.log('invokeId = ' + invokeId)

  // accept request and reply with confirmation
  const responseData = heartbeatResponse(invokeId)
  // console.log('responseData', responseData)
  socket.write(responseData)
}
