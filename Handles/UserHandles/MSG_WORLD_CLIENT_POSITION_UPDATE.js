const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');

function MSG_WORLD_CLIENT_GAME_MSG (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_POSITION_UPDATE
    ].join(),
    function (server, packet, user) {
      // I don't really care about this for now, but this is where I would run validation checks?
      // put this here to prevent the log from clogging up
    }
  );
}

module.exports = MSG_WORLD_CLIENT_GAME_MSG;
