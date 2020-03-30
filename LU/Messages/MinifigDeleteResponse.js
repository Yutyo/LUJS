const Message = require('../Message');

const DeletionResponse = {
  SUCCESS: 1
};

class MinifigDeleteResponse extends Message {
  constructor () {
    super();
    this.id = DeletionResponse.SUCCESS;
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

module.exports = { MinifigDeleteResponse, DeletionResponse };
