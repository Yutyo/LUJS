const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const {
  MinifigDeleteResponse
} = require('../../../LU/Messages/MinifigDeleteResponse');

const { Character } = require('../../../DB/LUJS');

function MSG_WORLD_CLIENT_CHARACTER_DELETE_REQUEST (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_CHARACTER_DELETE_REQUEST
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      const characterID = packet.readLongLong();

      Character.destroy({
        where: {
          id: characterID
        }
      }).then(function () {
        const response = new MinifigDeleteResponse();

        const send = new BitStream();
        send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
        send.writeShort(LURemoteConnectionType.client);
        send.writeLong(LUClientMessageType.DELETE_CHARACTER_RESPONSE);
        send.writeByte(0);
        response.serialize(send);
        client.send(send, Reliability.RELIABLE_ORDERED);
      });
    }
  );
}

module.exports = MSG_WORLD_CLIENT_CHARACTER_DELETE_REQUEST;
