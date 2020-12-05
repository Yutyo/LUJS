import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

export const CreationResponse = {
  SUCCESS: 0,
  DOES_NOT_WORK: 1,
  NAME_NOT_ALLOWED: 2,
  PREDEFINED_NAME_IN_USE: 3,
  CUSTOM_NAME_IN_USE: 4
};

export class MinifigCreateResponse extends Message {
  id: number;

  constructor() {
    super();
    this.id = CreationResponse.NAME_NOT_ALLOWED;
  }

  deserialize(stream: BitStream): void {
    this.id = stream.readByte();
  }

  serialize(stream: BitStream): void {
    stream.writeByte(this.id);
  }
}
