const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUGeneralMessageType = require('../../../LU/Message Types/LUGeneralMessageType')
  .LUGeneralMessageType;
const VersionConfirm = require('../../../LU/Messages/VersionConfirm');
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');

function MSG_SERVER_VERSION_CONFIRM (handler) {
  handler.on(
    [
      LURemoteConnectionType.general,
      LUGeneralMessageType.MSG_SERVER_VERSION_CONFIRM
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);
      const message = new VersionConfirm();
      message.deserialize(packet);
      message.unknown = 0x93;
      message.remoteConnectionType = 4;
      if (server.port === 1001) {
        // If this is an auth server
        message.remoteConnectionType = 1;
      }
      message.processID = process.pid;
      message.localPort = 0xffff;
      message.localIP = server.ip;

      // TODO: This needs to be brought into a method inside something
      const send = new BitStream();
      send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
      send.writeShort(LURemoteConnectionType.general);
      send.writeLong(LUGeneralMessageType.MSG_SERVER_VERSION_CONFIRM);
      send.writeByte(0);
      message.serialize(send);
      client.send(send, Reliability.RELIABLE_ORDERED);
    }
  );
}

module.exports = MSG_SERVER_VERSION_CONFIRM;
