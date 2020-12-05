import BitStream from 'node-raknet/structures/BitStream';
import Message from '../Message';

export const DisconnectNotifyReason = {
  UNKNOWN_SERVER_ERROR: 0x00,
  DUPLICATE_LOGIN: 0x04,
  SERVER_SHUTDOWN: 0x05,
  SERVER_UNABLE_TO_LOAD_MAP: 0x06,
  INVALID_SESSION_KEY: 0x07,
  ACCOUNT_NOT_PENDING: 0x08,
  CHARACTER_NOT_FOUND: 0x09,
  CORRUPT_CHARACTER: 0xa,
  KICK: 0x0b,
  FREE_TRIAL_EXPIRED: 0x0d,
  OUT_OF_PLAY_TIME: 0x0e
};

export class DisconnectNotify extends Message {
  reason: number;

  constructor() {
    super();
    this.reason = DisconnectNotifyReason.UNKNOWN_SERVER_ERROR;
  }

  deserialize(stream: BitStream): void {
    this.reason = stream.readLong();
  }

  serialize(stream: BitStream): void {
    stream.writeLong(this.reason);
  }
}
