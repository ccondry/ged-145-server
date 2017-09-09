const messageTypes = require('src/message-types')

const type = 'PARAM_CONF'

module.exports = function (invokeId) {
  const messageLength = 4
  const messageType = messageTypes.indexOf(type)
  let data = Buffer(12)
  data.writeUInt32BE(messageLength, 0)
  data.writeUInt32BE(messageType, 4)
  data.writeUInt32BE(invokeId, 8)
  return data
}
