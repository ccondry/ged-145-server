const tagTypes = require('src/tag-types')

module.exports = function (data) {
  let i = 0
  const callVars = {
    EXPANDED_CALL_VARIABLE_TAG: {},
    EXPANDED_CALL_ARRAY_TAG: []
  }
  // get tagged data (if any)
  while (data.length > i) {
    const tagTypeId = data.readUInt8(i++)
    const tagType = tagTypes[tagTypeId]
    const fieldLength = data.readUInt8(i++)
    switch (tagType) {
      case 'EXPANDED_CALL_VARIABLE_TAG': {
        // set the end index of all ECV vars
        const end = i + fieldLength
        // process all ECV data
        while (end > i) {
          let ecvName = new Buffer(31)
          // prime loop with char
          let letter = data.readUInt8(i++)
          // console.log('letter', letter)

          let j = 0
          // wait for null terminator
          while (letter != 0x00) {
            // concat character to name
            ecvName.writeUInt8(letter, j++)
            // get next char
            letter = data.readUInt8(i++)
            // console.log('letter', letter)
          }
          // ecvName is done - now get value
          let ecvValue = new Buffer(220)
          letter = data.readUInt8(i++)

          let k = 0
          // wait for null terminator
          while (letter != 0x00) {
            // concat character to name
            ecvValue.writeUInt8(letter, k++)
            // get next char
            letter = data.readUInt8(i++)
          }
          // console.log(`${ecvName} = ${ecvValue}`)
          // write to main data store object for this request
          // and trim the null (0x00) characters out of the buffer
          callVars.EXPANDED_CALL_VARIABLE_TAG[ecvName.toString('ascii', 0, j)] = ecvValue.toString('ascii', 0, k)
        }
        break
      }
      case 'EXPANDED_CALL_ARRAY_TAG': {
        const ecvIndex = data.readUInt8(i++)
        const ecvName = new Buffer(31)
        const ecvValue = new Buffer(220)

        // prime loop with char
        let letter = data.readUInt8(i++)
        // count name length
        let j = 0
        // wait for null terminator
        while (letter != 0x00) {
          // concat character to name
          ecvName.writeUInt8(letter, j++)
          // get next char
          letter = data.readUInt8(i++)
          // console.log('letter', letter)
        }
        // count ECV value length
        let k = 0
        // ecvName is done - now get value
        letter = data.readUInt8(i++)
        // wait for null terminator
        while (letter != 0x00) {
          // concat character to name
          ecvValue.writeUInt8(letter, k++)
          // get next char
          letter = data.readUInt8(i++)
        }
        callVars.EXPANDED_CALL_ARRAY_TAG.push({
          index: ecvIndex,
          name: ecvName.toString('ascii', 0, j),
          value: ecvValue.toString('ascii', 0, k)
        })
        break
      }
      default: {
        const fieldData = data.toString('ascii', i, i + fieldLength)
        // console.log(`${tagType} = ${fieldData}`)
        callVars[tagType] = fieldData
        // increment cursor
        i += fieldLength
      } // end default case
    } // end switch
  } // end while
  return callVars
}
