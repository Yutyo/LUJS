const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');
const GameMessageKey = require('lugamemessages/GameMessages').GameMessageKey;
const LWOOBJID = require('../../LU/LWOOBJID');
const GameMessageFactory = require('../../LU/GameMessageFactory');

function MSG_WORLD_CLIENT_GAME_MSG (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_GAME_MSG
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);
      const objectLow = packet.readLong();
      const objectHigh = packet.readLong();
      const targetID = new LWOOBJID(objectHigh, objectLow);
      const id = packet.readShort();

      console.log(
        `Game Message with ID ${GameMessageKey.key(id)}(${id.toString(
          16
        )}) for object ${new LWOOBJID(objectHigh, objectLow)}`
      );

      // TODO: route these to a game message manager as an event

      const gm = GameMessageFactory.generateMessageFromBitStream(id, packet);

      const obj = server
        .getServer()
        .manager.getManager('replica')
        .getObject(targetID);
      if (obj !== undefined) obj.emitGM(id, gm, client);
      else console.log(`Target not found ${objectLow}`);
    }
  );
}

module.exports = MSG_WORLD_CLIENT_GAME_MSG;
