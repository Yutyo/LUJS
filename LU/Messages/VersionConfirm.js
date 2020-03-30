const Message = require('../Message');

class VersionConfirm extends Message {
  constructor () {
    super();
    this.version = undefined;
    this.unknown = undefined;
    this.remoteConnectionType = undefined;
    this.processID = undefined;
    this.localPort = undefined;
    this.localIP = undefined;
  }

  /**
   *
   * @param {BitStream}stream
   */
  deserialize (stream) {
    this.version = stream.readLong();
    this.unknown = stream.readLong();
    this.remoteConnectionType = stream.readLong();
    this.processID = stream.readLong();
    this.localPort = stream.readShort();
    this.localIP = stream.readString();
  }

  serialize (stream) {
    stream.writeLong(this.version);
    stream.writeLong(this.unknown);
    stream.writeLong(this.remoteConnectionType);
    stream.writeLong(this.processID);
    stream.writeShort(this.localPort);
    stream.writeString(this.localIP);
  }
}

module.exports = VersionConfirm;
