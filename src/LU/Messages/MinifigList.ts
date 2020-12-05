import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

class Character {
  id: bigint;
  unknown1: number;
  name: string;
  unapprovedName: string;
  nameRejected: number;
  freeToPlay: number;
  unknown2: string;
  shirtColor: number;
  shirtStyle: number;
  pantsColor: number;
  hairStyle: number;
  hairColor: number;
  lh: number;
  rh: number;
  eyebrows: number;
  eyes: number;
  mouth: number;
  unknown3: number;
  zone: number;
  instance: number;
  clone: number;
  last_log: bigint;
  items: Array<number>;
}

export class MinifigList extends Message {
  characters;
  front: number;

  constructor() {
    super();
    this.characters = [];
    this.front = 0;
  }

  deserialize(stream: BitStream): void {
    const num = stream.readByte();
    this.front = stream.readByte();
    for (let i = 0; i < num; i++) {
      const character = new Character();
      character.id = stream.readLongLong();
      character.unknown1 = stream.readLong();
      character.name = stream.readWString();
      character.unapprovedName = stream.readWString();
      character.nameRejected = stream.readByte();
      character.freeToPlay = stream.readByte();
      character.unknown2 = stream.readString(10);
      character.shirtColor = stream.readLong();
      character.shirtStyle = stream.readLong();
      character.pantsColor = stream.readLong();
      character.hairStyle = stream.readLong();
      character.hairColor = stream.readLong();
      character.lh = stream.readLong();
      character.rh = stream.readLong();
      character.eyebrows = stream.readLong();
      character.eyes = stream.readLong();
      character.mouth = stream.readLong();
      character.unknown3 = stream.readLong();
      character.zone = stream.readShort();
      character.instance = stream.readShort();
      character.clone = stream.readLong();
      character.last_log = stream.readLongLong();
      character.items = [];
      const numItems = stream.readShort();
      for (let j = 0; j < numItems; j++) {
        character.items.push(stream.readLong());
      }
    }
  }

  serialize(stream: BitStream): void {
    stream.writeByte(this.characters.length);
    stream.writeByte(this.front); // TODO: This needs to be the index of the last used character
    for (let i = 0; i < this.characters.length; i++) {
      const character = this.characters[i];
      character.id.serialize(stream);
      stream.writeLong(character.unknown1);
      stream.writeWString(character.name);
      stream.writeWString(character.unapprovedName);
      stream.writeByte(character.nameRejected);
      stream.writeByte(character.freeToPlay);
      stream.writeString(character.unknown2, 10);
      stream.writeLong(character.shirtColor); // Works
      stream.writeLong(character.shirtStyle);
      stream.writeLong(character.pantsColor); // Works
      stream.writeLong(character.hairStyle); // Works
      stream.writeLong(character.hairColor); // Works
      stream.writeLong(character.lh);
      stream.writeLong(character.rh);
      stream.writeLong(character.eyebrows); // Works
      stream.writeLong(character.eyes); // Works
      stream.writeLong(character.mouth); // Doesn't
      stream.writeLong(character.unknown3);
      stream.writeShort(character.zone);
      stream.writeShort(character.instance);
      stream.writeLong(character.clone);
      stream.writeLongLong(character.last_log);
      stream.writeShort(character.items.length);
      for (let j = 0; j < character.items.length; j++) {
        stream.writeLong(character.items[j]);
      }
    }
  }
}

module.exports = MinifigList;
