import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';
import Vector3f from '../../geometry/Vector3f';

const Checksum = {
  1000: 548931708,
  1001: 644352572,
  1100: 1230132497,
  1101: 1401033954,
  1102: 265552858,
  1150: 265552858,
  1151: 176751363,
  1200: 3659426608,
  1201: 1198396208,
  1203: 284951810,
  1204: 131334744,
  1250: 93127057,
  1251: 156173405,
  1260: 404031453,
  1300: 317375120,
  1302: 192348911,
  1303: 355338122,
  1350: 79036764,
  1400: 2233038349,
  1402: 49611143,
  1403: 2172981070,
  1450: 66060582,
  1600: 130155246,
  1601: 36831494,
  1602: 127075199,
  1603: 70975917,
  1604: 404031453,
  1700: 33816888,
  1800: 1259840409,
  1900: 2655712316,
  2000: 1298738292,
  2001: 166396143
};

export class LoadStaticZone extends Message {
  zoneID: number;
  instanceID: number;
  cloneID: number;
  unknown1: number;
  location: Vector3f;
  worldState: number;
  checksum: number;

  constructor() {
    super();
    this.zoneID = 0;
    this.instanceID = 0;
    this.cloneID = 0;
    this.unknown1 = 0;
    this.location = new Vector3f();
    this.worldState = 0;
    this.checksum = 0;
  }

  deserialize(stream: BitStream): void {
    this.zoneID = stream.readShort();
    this.cloneID = stream.readShort();
    this.instanceID = stream.readLong();
    this.checksum = stream.readLong();
    this.unknown1 = stream.readShort();
    this.location.x = stream.readFloat();
    this.location.y = stream.readFloat();
    this.location.z = stream.readFloat();
    this.worldState = stream.readLong();
  }

  serialize(stream: BitStream): void {
    stream.writeShort(this.zoneID);
    stream.writeShort(this.instanceID);
    stream.writeLong(this.instanceID);
    stream.writeLong(Checksum[this.zoneID]);
    stream.writeShort(this.unknown1);
    stream.writeFloat(this.location.x);
    stream.writeFloat(this.location.y);
    stream.writeFloat(this.location.z);
    stream.writeLong(this.worldState);
  }
}
