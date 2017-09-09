const response = require('src/responses/param')

module.exports = function (socket, data) {
  // buffer cursor
  let c = 0
  const invokeId = data.readUInt32BE(c)
  c += 4
  const paramId = data.readUInt32BE(c)
  c += 4
  const paramValue = data.readUInt32BE(c)
  c += 4
  // do nothing - just accept request and reply with confirmation
  const responseData = response(invokeId)
  socket.write(responseData)
}
