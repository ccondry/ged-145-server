const messageTypes = require('src/message-types')

const type = 'OPEN_CONF'

module.exports = function (invokeId) {
  // console.log(`creating ${type} message`)
  // data size = 12 bytes
  let data = Buffer(12)

  // message header
  // length of message after header
  const messageLength = 4
  data.writeUInt32BE(messageLength, 0)
  // message type integer
  const messageType = messageTypes.indexOf(type)
  data.writeUInt32BE(messageType, 4)

  // message body
  // ID of the request, to correlate responses on client side
  data.writeUInt32BE(invokeId, 8)
  return data
}
