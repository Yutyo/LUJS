const Message = require('../Message');

class MinifigCreateRequest extends Message {
  constructor () {
    super();
    this.name = '';
    this.firstName = 0;
    this.middleName = 0;
    this.lastName = 0;
    this.unknown1 = '';
    this.shirtColor = 0;
    this.shirtStyle = 0;
    this.pantsColor = 0;
    this.hairStyle = 0;
    this.hairColor = 0;
    this.lh = 0;
    this.rh = 0;
    this.eyebrows = 0;
    this.eyes = 0;
    this.mouth = 0;
    this.unknown2 = 0;
  }

  /**
   *
   * @param {BitStream}stream
   */
  deserialize (stream) {
    this.name = stream.readWString();
    this.firstName = stream.readLong();
    this.middleName = stream.readLong();
    this.lastName = stream.readLong();
    this.unknown1 = stream.readString(9);
    this.shirtColor = stream.readLong();
    this.shirtStyle = stream.readLong();
    this.pantsColor = stream.readLong();
    this.hairStyle = stream.readLong();
    this.hairColor = stream.readLong();
    this.lh = stream.readLong();
    this.rh = stream.readLong();
    this.eyebrows = stream.readLong();
    this.eyes = stream.readLong();

    this.mouth = stream.readLong();
    this.unknown2 = stream.readByte();
  }

  serialize (stream) {
    stream.writeWString(this.name);
    stream.writeLong(this.firstName);
    stream.writeLong(this.middleName);
    stream.writeLong(this.lastName);
    stream.writeString(this.unknown1, 9);
    stream.writeLong(this.shirtColor);
    stream.writeLong(this.shirtStyle);
    stream.writeLong(this.pantsColor);
    stream.writeLong(this.hairStyle);
    stream.writeLong(this.hairColor);
    stream.writeLong(this.lh);
    stream.writeLong(this.rh);
    stream.writeLong(this.eyebrows);
    stream.writeLong(this.eyes);
    stream.writeLong(this.mouth);
    stream.writeByte(this.unknown2);
  }
}

module.exports = MinifigCreateRequest;
