import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

export const DeletionResponse = {
  SUCCESS: 1
};

export class MinifigDeleteResponse extends Message {
  id: number;

  constructor() {
    super();
    this.id = DeletionResponse.SUCCESS;
  }

  deserialize(stream: BitStream): void {
    this.id = stream.readByte();
  }

  serialize(stream: BitStream): void {
    stream.writeByte(this.id);
  }
}
