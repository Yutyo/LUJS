import { GameMessage, GameMessageKey } from 'lugamemessages/GameMessages';
import BitStream from 'node-raknet/structures/BitStream';

export default class GameMessageFactory {
  /**
   *
   * @param {number} ID
   * @param {object} properties
   */
  static makeMessage(ID: number, properties = {}): LUGameMessage {
    const gm = GameMessage[ID];
    if (gm !== undefined) {
      const toRet = new LUGameMessage(ID);
      toRet.properties = properties;
      return toRet;
    }
  }

  /**
   * Create a GM from an ID and the stream containing the data
   * @param id
   * @param stream
   */
  static generateMessageFromBitStream(
    id: number,
    stream: BitStream
  ): LUGameMessage {
    const toRet = new LUGameMessage(id);
    toRet.deserialize(stream);
    return toRet;
  }
}

class LUGameMessage {
  #id: number;
  #data: { [characterName: string]: any };

  /**
   *
   * @param {number} id
   */
  constructor(id: number) {
    this.#id = id;
    this.#data = {};
  }

  /**
   *
   * @param {BitStream} stream
   */
  serialize(stream: BitStream): void {
    stream.writeShort(this.#id);

    const structure = GameMessage[this.#id];

    for (const name in structure) {
      if (!structure.hasOwnProperty.call(name)) continue;

      if (structure[name].default !== undefined) {
        if (this.#data[name] === undefined) {
          // if the data is omitted then we just use default values
          if (structure[name].type !== 'bit') {
            stream.writeBit(false);
          } else {
            stream.writeBit(structure[name].default);
          }
          continue;
        } else {
          if (structure[name].type !== 'bit') {
            stream.writeBit(true);
          }
        }
      } else {
        // if there is no default then if we don't have data defined for this field we need to throw an error
        if (this.#data[name] === undefined) {
          throw Error(
            name +
              ' was not provided when creating game message ' +
              GameMessageKey.key(this.#id)
          );
        }
      }

      switch (structure[name].type) {
        case 'bit':
          stream.writeBit(this.#data[name]);
          break;
        case 'int':
          stream.writeLong(this.#data[name]);
          break;
        case 'float':
          stream.writeFloat(this.#data[name]);
          break;
      }
    }
  }

  /**
   *
   * @param {BitStream} stream
   */
  deserialize(stream: BitStream): void {
    const structure = GameMessage[this.#id];

    for (const name in structure) {
      if (!structure.hasOwnProperty.call(name)) continue;

      switch (structure[name].type) {
        case 'int':
          this.#data[name] = stream.readLong();
          break;
        case 'wstring': {
          let temp = '';
          const length = stream.readLong();
          for (let i = 0; i < length; i++) {
            temp += String.fromCharCode(stream.readShort());
          }
          this.#data[name] = temp;
          break;
        }
      }
    }
  }

  get properties(): { [characterName: string]: any } {
    return this.#data;
  }

  /**
   *
   * @param properties
   */
  set properties(properties: { [characterName: string]: any }) {
    this.#data = properties;
  }
}
