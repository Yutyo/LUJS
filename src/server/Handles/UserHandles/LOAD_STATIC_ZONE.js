const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const LoadStaticZone = require('../../../LU/Messages/LoadStaticZone');

function LOAD_STATIC_ZONE (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_VALIDATION
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      if (server.getServer().zoneID > 0) {
        // They are connected to a world server, time to send them some information
        const response = new LoadStaticZone();

        response.zoneID = server.getServer().zoneID;

        const send = new BitStream();
        send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
        send.writeShort(LURemoteConnectionType.client);
        send.writeLong(LUClientMessageType.LOAD_STATIC_ZONE);
        send.writeByte(0);
        response.serialize(send);
        client.send(send, Reliability.RELIABLE_ORDERED);
      }
    }
  );
}

module.exports = LOAD_STATIC_ZONE;
