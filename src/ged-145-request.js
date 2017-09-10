const messageTypes = require('./message-types')

module.exports = class {
  constructor (data) {
    try {
      this.messageLength = data.readUInt32BE(0)
      // console.log('messageLength', this.messageLength)
    } catch (e) {
      throw `couldn't cast messageLength to a number`
    }
    try {
      // Type of the message
      this.messageTypeId = data.readUInt32BE(4)
      // console.log('messageType', this.messageTypeId)

      this.messageType = messageTypes[this.messageTypeId]
      // console.log('message type = ', this.messageType)

      // typing went OK, so get body
      this.data = data
      this.messageBody = this.data.slice(8)
    } catch (e) {
      console.log(e)
      const msg = 'error casting message to a type. type ID received was ' + this.messageTypeId
      console.log(msg)
      throw msg
    }
  }
}
