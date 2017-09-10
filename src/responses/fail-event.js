const messageTypes = require('../message-types')

const type = 'FAILURE_CONF'

module.exports = function (status, errorText) {
  let data = Buffer(512)

  // buffer cursor - start at 4, after the length bytes
  let c = 4

  // message type integer
  const messageType = messageTypes.indexOf(type)
  data.writeUInt32BE(messageType, c)
  c += 4

  // status code
  data.writeUInt32BE(status, c)
  c += 4

  // status message
  if (errorText) {
    data.write(errorText, c, errorText.length, 'utf8')
    c += errorText.length
  }

  // write data length to first position in buffer
  data.writeUInt32BE(c - 8, 0)

  // return just the part of our data with content
  return data.slice(0, c)
}
