import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

class VersionConfirm extends Message {
  version: number;
  unknown: number;
  remoteConnectionType: number;
  processID: number;
  localPort: number;
  localIP: string;

  constructor() {
    super();
    this.version = undefined;
    this.unknown = undefined;
    this.remoteConnectionType = undefined;
    this.processID = undefined;
    this.localPort = undefined;
    this.localIP = undefined;
  }

  deserialize(stream: BitStream): void {
    this.version = stream.readLong();
    this.unknown = stream.readLong();
    this.remoteConnectionType = stream.readLong();
    this.processID = stream.readLong();
    this.localPort = stream.readShort();
    this.localIP = stream.readString();
  }

  serialize(stream: BitStream): void {
    stream.writeLong(this.version);
    stream.writeLong(this.unknown);
    stream.writeLong(this.remoteConnectionType);
    stream.writeLong(this.processID);
    stream.writeShort(this.localPort);
    stream.writeString(this.localIP);
  }
}

module.exports = VersionConfirm;
