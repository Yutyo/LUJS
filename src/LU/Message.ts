import BitStream from 'node-raknet/structures/BitStream';

export default abstract class Message {
  abstract serialize(stream: BitStream): void;

  abstract deserialize(stream: BitStream): void;
}
