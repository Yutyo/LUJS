import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

export default class TransferToWorld extends Message {
  ip: string;
  port: number;
  mythranShift: boolean;

  constructor() {
    super();
    this.ip = '';
    this.port = 0;
    this.mythranShift = false;
  }

  deserialize(stream: BitStream): void {
    this.ip = stream.readString();
    this.port = stream.readShort();
    this.mythranShift = stream.readBoolean();
  }

  serialize(stream: BitStream): void {
    stream.writeString(this.ip);
    stream.writeShort(this.port);
    stream.writeBoolean(this.mythranShift);
  }
}
