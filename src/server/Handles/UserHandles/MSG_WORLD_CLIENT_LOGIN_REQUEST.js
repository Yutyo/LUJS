const RakMessages = require('node-raknet/RakMessages.js');
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const TransferToWorld = require('../../../LU/Messages/TransferToWorld');
const { ServerManager } = require('../../ServerManager');
const { Character } = require('../../../DB/LUJS');

function MSG_WORLD_CLIENT_LOGIN_REQUEST (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_LOGIN_REQUEST
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      let characterID = packet.readLongLong();

      client.session.character_id = Number(characterID);
      client.session.save();

      Character.findOne({
        where: {
          id: characterID.low
        }
      }).then(function (character) {
        if (character.zone === 0) {
          character.zone = 1000;
        }

        ServerManager.request(character.zone).then(server => {
          const zone = server;
          character.x = zone.luz.spawnX;
          character.y = zone.luz.spawnY;
          character.z = zone.luz.spawnZ;
          character.rotation_x = zone.luz.spawnrX;
          character.rotation_y = zone.luz.spawnrY;
          character.rotation_z = zone.luz.spawnrZ;
          character.rotation_w = zone.luz.spawnrW;
          character.save();

          const response = new TransferToWorld();
          response.ip = zone.ip;
          response.port = zone.port;
          response.mythranShift = false;

          const send = new BitStream();
          send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
          send.writeShort(LURemoteConnectionType.client);
          send.writeLong(LUClientMessageType.TRANSFER_TO_WORLD);
          send.writeByte(0);
          response.serialize(send);
          client.send(send, Reliability.RELIABLE_ORDERED);
        });
      });
    }
  );
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;
