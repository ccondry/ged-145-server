const messageTypes = require('src/message-types')
const statusCodes = require('src/status-codes')
const tagTypes = require('src/tag-types')

const type = 'FAILURE_CONF'

module.exports = function (invokeId, status, errorText) {
  let data = Buffer(256 - 8)

  // buffer cursor - start at 4, after the length bytes
  let c = 4

  // message type integer
  const messageType = messageTypes.indexOf(type)
  data.writeUInt32BE(messageType, c)
  c += 4

  // ID of the request, to correlate responses on client side
  data.writeUInt32BE(invokeId, c)
  c += 4

  // status code
  data.writeUInt32BE(statusCodes[status], c)
  c += 4

  // status message
  if (errorText) {
    const tagType = tagTypes['ERROR_TAG']
    const length = errorText.length
    data.writeUInt8(tagType, c++)
    data.writeUInt8(length, c++)
    data.write(errorText, c, length, 'utf8')
    c += length
  }

  // write data length to first position in buffer
  data.writeUInt32BE(c - 8, 0)

  // return just the part of our data with content
  return data.slice(0, c)
}
