const Message = require('../Message');

const CreationResponse = {
  SUCCESS: 0,
  DOES_NOT_WORK: 1,
  NAME_NOT_ALLOWED: 2,
  PREDEFINED_NAME_IN_USE: 3,
  CUSTOM_NAME_IN_USE: 4
};

class MinifigCreateResponse extends Message {
  constructor () {
    super();
    this.id = CreationResponse.NAME_NOT_ALLOWED;
  }

  /**
   *
   * @param {BitStream}stream
   */
  deserialize (stream) {
    this.id = stream.readByte();
  }

  serialize (stream) {
    stream.writeByte(this.id);
  }
}

module.exports = { MinifigCreateResponse, CreationResponse };
