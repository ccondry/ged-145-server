const messageTypes = require('../message-types')
const errors = require('../status-codes')
const tagTypes = require('../tag-types')

const type = 'QUERY_RESP'

module.exports = function (invokeId, reject, tags) {
  // console.log(`creating ${type} message`)

  // max tags data size should be less than 2500, the max total bytes for CTI Server
  const tagsBuffer = new Buffer(2500)
  let n = 0
  if (tags) {
    // write each tag to the buffer
    for (const key of Object.keys(tags)) {
      const value = tags[key]
      const tagType = tagTypes.indexOf(key)
      if (tagType < 0) {
        // invalid or unrecognized tag type
        // continue next for loop iteration to next tag
        continue
      }
      // determine type of tag
      switch (key) {
        case 'EXPANDED_CALL_VARIABLE_TAG': {
          // for each ecv data element
          for (const ecvName of Object.keys(value)) {
            // append type of data to buffer
            tagsBuffer.writeUInt8(tagType, n++)

            // position in buffer of ECV data length
            const lengthPosition = n++
            // length counter
            const i = n
            const ecvValue = value[ecvName]


            // write name
            tagsBuffer.write(ecvName, n, ecvName.length, 'ascii')
            // update cursor
            n += ecvName.length
            // null terminate name
            tagsBuffer.writeUInt8(0x00, n++)

            // write value
            tagsBuffer.write(ecvValue, n, ecvValue.length, 'ascii')
            // update cursor
            n += ecvValue.length
            // null terminate name
            tagsBuffer.writeUInt8(0x00, n++)

            // write length, now that we know it
            tagsBuffer.writeUInt8(n - i, lengthPosition)
          }
          break
        }
        case 'EXPANDED_CALL_ARRAY_TAG': {
          // for each ecv array data element
          for (const element of value) {
            // append type of data to buffer
            tagsBuffer.writeUInt8(tagType, n++)
            // position in buffer of ECV data length
            const lengthPosition = n++
            // length counter
            const i = n
            // write array index
            tagsBuffer.writeUInt8(element.index, n++)
            // write data name
            tagsBuffer.write(element.name, n, element.name.length, 'ascii')
            // update cursor
            n += element.name.length
            // write null terminator
            tagsBuffer.writeUInt8(0x00, n++)
            // write data value
            tagsBuffer.write(element.value, n, element.value.length, 'ascii')
            // update cursor
            n += element.value.length
            // write null terminator
            tagsBuffer.writeUInt8(0x00, n++)
            // write length, now that we know it
            tagsBuffer.writeUInt8(n - i, lengthPosition)
          }
          break
        }
        default: {
          // append type of data to buffer
          tagsBuffer.writeUInt8(tagType, n++)
          // data length
          tagsBuffer.writeUInt8(value.length, n++)
          // write data
          tagsBuffer.write(value, n, value.length, 'ascii')
          // update cursor
          n += value.length
        }
      }
    }
  }
  const trimTagsBuffer = tagsBuffer.slice(0, n)
  // console.log('trimTagsBuffer', trimTagsBuffer)

  // data size = 16 bytes for header, invokeId, and reject
  // plus the size of the attached variables, if any
  const data = Buffer(16 + trimTagsBuffer.length)

  // message header
  // length of message body (after header)
  const messageLength = data.length - 8
  let i = 0
  data.writeUInt32BE(messageLength, i)
  i += 4
  // message type integer
  const messageType = messageTypes.indexOf(type)
  data.writeUInt32BE(messageType, i)
  i += 4

  // message body
  // ID of the request, to correlate responses on client side
  data.writeUInt32BE(invokeId, i)
  i += 4

  if (reject) {
    try {
      // write given reject reason
      data.writeUInt32BE(reject, i)
    } catch (e) {
      // write unspecified error
      data.writeUInt32BE(errors.indexOf('E_AG_HOST_ERROR1'), i)
    }
  } else {
    // write no error
    data.writeUInt32BE(errors.indexOf('E_AG_NO_ERROR'), i)
  }
  i += 4

  if (trimTagsBuffer.length > 0) {
    // add tags to main data buffer
    trimTagsBuffer.copy(data, i, 0)
  }
  // console.log('return data', data.toString('hex'))
  return data
}
