import BitStream from 'node-raknet/structures/BitStream';

class LDFStruct {
  key: string;
  type: number;
  value: any;

  constructor(key: string, type: number, value: any) {
    this.key = key;
    this.type = type;
    this.value = value;
  }
}

export default class LDF {
  #ldf: Array<LDFStruct>;

  constructor() {
    this.#ldf = [];
  }

  addWString(key: string, value: string) {
    this.#ldf.push(new LDFStruct(key, 0, value));
  }

  addSignedLong(key: string, value: number) {
    this.#ldf.push(new LDFStruct(key, 1, value));
  }

  addFloat(key: string, value: number) {
    this.#ldf.push(new LDFStruct(key, 3, value));
  }

  addDouble(key: string, value: number) {
    this.#ldf.push(new LDFStruct(key, 4, value));
  }

  addLong(key: string, value: number) {
    this.#ldf.push(new LDFStruct(key, 5, value));
  }

  addBoolean(key: string, value: boolean) {
    this.#ldf.push(new LDFStruct(key, 7, value));
  }

  addSignedLongLong(key: string, value: bigint) {
    this.#ldf.push(new LDFStruct(key, 8, value));
  }

  addLWOOBJID(key: string, value: bigint) {
    this.#ldf.push(new LDFStruct(key, 9, value));
  }

  addByteString(key: string, value: string) {
    this.#ldf.push(new LDFStruct(key, 13, value));
  }

  serialize(stream: BitStream) {
    stream.writeLong(this.#ldf.length);
    for (let i = 0; i < this.#ldf.length; i++) {
      const ldf = this.#ldf[i];
      stream.writeByte(ldf.key.length * 2);
      for (let k = 0; k < ldf.key.length; k++) {
        stream.writeChar(ldf.key.charCodeAt(k));
        stream.writeByte(0);
      }
      stream.writeByte(ldf.type);
      switch (ldf.type) {
        case 0:
          stream.writeLong(ldf.value.length);
          for (let k = 0; k < ldf.value.length; k++) {
            stream.writeShort(ldf.value.charCodeAt[k]);
          }
          break;
        case 1:
          stream.writeSignedLong(ldf.value);
          break;
        case 3:
          stream.writeFloat(ldf.value);
          break;
        case 4:
          // TODO: Not implemented yet
          // stream.writeDouble(ldf.value);
          break;
        case 5:
          stream.writeLong(ldf.value);
          break;
        case 7:
          stream.writeBoolean(ldf.value);
          break;
        case 8:
          stream.writeLongLong(ldf.value);
          break;
        case 9:
          stream.writeLongLong(ldf.value);
          break;
        case 13:
          stream.writeLong(ldf.value.length);
          for (let k = 0; k < ldf.value.length; k++) {
            stream.writeByte(ldf.value.charCodeAt[k]);
          }
          break;
      }
    }
  }
}
