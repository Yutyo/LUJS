const Message = require('../Message');

const DisconnectNotifyReason = {
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

class DisconnectNotify extends Message {
  constructor () {
    super();
    this.reason = DisconnectNotifyReason.UNKNOWN_SERVER_ERROR;
  }

  /**
   *
   * @param {BitStream}stream
   */
  deserialize (stream) {
    this.reason = stream.readLong();
  }

  serialize (stream) {
    stream.writeLong(this.reason);
  }
}

module.exports = { DisconnectNotify, DisconnectNotifyReason };
