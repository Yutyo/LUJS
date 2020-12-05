const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;

function MSG_WORLD_CLIENT_ROUTE_PACKET (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_ROUTE_PACKET
    ].join(),
    (server, packet, user) => {
      // TODO: something I guess?
    }
  );
}

module.exports = MSG_WORLD_CLIENT_ROUTE_PACKET;
