const Message = require('../Message');

class UserSessionInfo extends Message {
  constructor () {
    super();
    this.username = undefined;
    this.key = undefined;
    this.hash = undefined;
  }

  /**
   *
   * @param {BitStream}stream
   */
  deserialize (stream) {
    this.username = stream.readWString();
    this.key = stream.readWString();
    this.hash = stream.readString();
  }

  serialize (stream) {
    stream.writeWString(this.username);
    stream.writeWString(this.key);
    stream.writeString(this.hash);
  }
}

module.exports = UserSessionInfo;
