import Message from '../Message';
import BitStream from 'node-raknet/structures/BitStream';

export const LoginCodes = {
  failedOne: 0,
  success: 1,
  banned: 2,
  failedTwo: 3,
  failedThree: 4,
  badPermissions: 5,
  badPassword: 6,
  accountLocked: 7,
  badUsername: 8,
  activationPending: 9,
  accountDisabled: 10,
  noMoreGameTime: 11,
  freeTrialEnded: 12,
  playScheduleNotAllowed: 13,
  accountNotActivated: 14
};

class Stamp {
  id: number;
  num1: number;
  num2: number;
  num3: number;
}

export class LoginInfo extends Message {
  code: number;
  password: string;
  string: string;
  clientVersionMajor: number;
  clientVersionCurrent: number;
  clientVersionMinor: number;
  session: string;
  redirectIP: string;
  chatIP: string;
  redirectPort: number;
  chatPort: number;
  altIP: string;
  guid: string;
  unknown: number;
  localization: string;
  firstSubscription: boolean;
  freeToPlay: boolean;
  unknown2: number;
  customErrorMessage: string;
  stamps: Array<Stamp>;

  constructor() {
    super();
    this.code = 0;
    this.password = 'Talk_Like_A_Pirate';
    this.string = '';
    this.clientVersionMajor = 0;
    this.clientVersionCurrent = 0;
    this.clientVersionMinor = 0;
    this.session = '';
    this.redirectIP = '';
    this.chatIP = '';
    this.redirectPort = 0;
    this.chatPort = 0;
    this.altIP = '';
    this.guid = '00000000-0000-0000-0000-000000000000';
    this.unknown = 0;
    this.localization = '';
    this.firstSubscription = false;
    this.freeToPlay = false;
    this.unknown2 = 0;
    this.customErrorMessage = '';
    this.stamps = [];
  }

  /**
   *
   * @param {BitStream} stream
   */
  deserialize(stream) {
    this.code = stream.readByte();
    this.password = stream.readString();

    this.string = stream.readString();
    this.string = stream.readString();
    this.string = stream.readString();
    this.string = stream.readString();
    this.string = stream.readString();
    this.string = stream.readString();
    this.string = stream.readString();

    this.clientVersionMajor = stream.readShort();
    this.clientVersionCurrent = stream.readShort();
    this.clientVersionMinor = stream.readShort();

    this.session = stream.readWString();
    this.redirectIP = stream.readString();
    this.chatIP = stream.readString();
    this.redirectPort = stream.readShort();
    this.chatPort = stream.readShort();
    this.altIP = stream.readString();
    this.guid = stream.readString();
    this.unknown = stream.readLong();
    this.localization = stream.readString();
    this.firstSubscription = stream.readByte();
    this.freeToPlay = stream.readByte();
    this.unknown2 = stream.readLongLong();
    const customErrorMessageLength = stream.readShort();
    this.customErrorMessage = stream.readWString(customErrorMessageLength);
    const stampsLength = stream.readLong();
    for (let i = 0; i < stampsLength; i++) {
      // push back stamps to this.stamps
    }
  }

  /**
   *
   * @param {BitStream} stream
   */
  serialize(stream) {
    stream.writeByte(this.code);
    stream.writeString(this.password);

    stream.writeString(this.string);
    stream.writeString(this.string);
    stream.writeString(this.string);
    stream.writeString(this.string);
    stream.writeString(this.string);
    stream.writeString(this.string);
    stream.writeString(this.string);

    stream.writeShort(this.clientVersionMajor);
    stream.writeShort(this.clientVersionCurrent);
    stream.writeShort(this.clientVersionMinor);

    stream.writeWString(this.session);

    stream.writeString(this.redirectIP);
    stream.writeString(this.chatIP);

    stream.writeShort(this.redirectPort);
    stream.writeShort(this.chatPort);

    stream.writeString(this.altIP);

    stream.writeString(this.guid, 37);

    stream.writeLong(this.unknown);
    stream.writeString(this.localization, 3);
    stream.writeByte(this.firstSubscription ? 1 : 0);
    stream.writeByte(this.freeToPlay ? 1 : 0);
    stream.writeLongLong(this.unknown2);
    stream.writeShort(this.customErrorMessage.length);
    stream.writeWString(
      this.customErrorMessage,
      this.customErrorMessage.length
    );
    stream.writeLong(this.stamps.length * 16 + 4);
    for (let i = 0; i < this.stamps.length; i++) {
      stream.writeLong(this.stamps[i].id);
      stream.writeLong(this.stamps[i].num1);
      stream.writeLong(this.stamps[i].num2);
      stream.writeLong(this.stamps[i].num3);
    }
  }
}
