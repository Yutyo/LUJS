import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

export class UserSessionInfo extends Message {
  username: string;
  key: string;
  hash: string;

  constructor() {
    super();
    this.username = undefined;
    this.key = undefined;
    this.hash = undefined;
  }

  deserialize(stream: BitStream): void {
    this.username = stream.readWString();
    this.key = stream.readWString();
    this.hash = stream.readString();
  }

  serialize(stream: BitStream): void {
    stream.writeWString(this.username);
    stream.writeWString(this.key);
    stream.writeString(this.hash);
  }
}
