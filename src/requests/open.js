const openConfirmation = require('../responses/open-confirmation')

module.exports = function (socket, data) {
  let i = 0
  // An ID for this message, which should be included in the response.
  const invokeId = data.readUInt32BE(i)
  i += 4
  // console.log('invokeId = ' + invokeId)

  // Version number of the interface. Currently 2
  const versionNumber = data.readUInt32BE(i)
  i += 4
  // console.log('versionNumber = ' + versionNumber)

  // Session idle timer value, in milliseconds. If the host
  // does not hear from the router in this time, it should
  // close the connection. This value is set to 4 times the
  // heartbeat interval.
  const idleTimeout = data.readUInt32BE(i)
  i += 4
  // console.log('idleTimeout = ' + idleTimeout)

  // Indicates the kind of encryption being done. 0 = none,
  // 1 = private key known to both ends of the connection.
  const encryption = data.readUInt32BE(i)
  i += 4
  // console.log('encryption = ' + encryption)

  // console.log('messageLength', messageLength)
  // console.log('cursor', cursor)
  if (data.length > i) {
    // console.log('message contains optional data')
    // This is an optional connection string, configured in the
    // ICM database. It is only sent if it specified in the ICM
    // Application_Gateway configuration. (CONFIG_TAG)
    const field = data.readInt8(i++)
    // console.log('field = ' + field)

    const fieldLength = data.readInt8(i++)
    // console.log('fieldLength = ' + fieldLength)

    const connectString = data.toString('ascii', i++, i + fieldLength)
    // console.log('connectString', connectString)

    // is encryption enabled for this connection?
    if (encryption === 1) {
      // DES encryption key to use for this session. Only sent if
      // encryption is enabled.
      const sessionKey = data.toString('ascii', i++)
      // console.log('sessionKey', sessionKey)
    } else {
      console.log('no encryption')
    }
  } else {
    // console.log('no optional data')
  }

  // accept request and reply with confirmation
  const responseData = openConfirmation(invokeId)
  // console.log('responseData', responseData)
  socket.write(responseData)
}
