const queryResponse = require('src/responses/query')
const parseEcvVars = require('src/parse/ecv')
const errors = require('src/errors')
const testData = require('../../test/tags.js')

module.exports = async function (socket, data, callback) {
  const callData = {}
  let i = 0
  // An ID for this message, which should be included in the response.
  callData.invokeId = data.readUInt32BE(i)
  i += 4
  // console.log('invokeId = ' + invokeId)

  // The RouterCallDay and RouterCallKey fields together
  // form a 64 bit unique ID to identify any Cisco ICM call.
  // A host might save this value to relate its processing
  // back to a Route_Call_Detail record in the database.
  callData.routerCallDay = data.readUInt32BE(i)
  i += 4
  callData.routerCallKey = data.readUInt32BE(i)
  i += 4

  const flags = data.slice(i, i+1).readUInt8(0)
  i += 1
  // console.log('flags:', flags)

  if ((flags & 0x01) === 0x01) {
    // Duplicate Request
    // HA mode is set to 'duplicate request' and this instance has received a
    // message that is a duplicate, so don't take action as we are currently
    // the standby server in HA
    callData.duplicateRequest = true
  }
  // console.log('(flags & 0x02)', (flags & 0x02))
  if ((flags & 0x02) === 0x02) {
    // NoScriptReply
    // ICM doesn't want any data in the response
    callData.noScriptReply = true
  }

  callData.ecvVars = parseEcvVars(data.slice(i))
  console.log('callData =', callData)

  let processedData
  if (callData.duplicateRequest) {
    // we received the duplicate request in our HA setup, so don't do anything
  } else {
    // process data
    try {
      // run callback and await the results
      processedData = await callback(callData)
      // processedData = testData
    } catch (e) {
      // return failure response
      socket.write(failResponse(callData.invokeId, statusCode, statusMessage))
    }
  }
  if (callData.noScriptReply) {
    // response with no attached call variables in reply (ACK)
    socket.write(queryResponse(callData.invokeId, errors.none))
  } else {
    // response with call data returned
    socket.write(queryResponse(callData.invokeId, errors.none, processedData))
  }
}
