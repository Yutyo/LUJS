const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUGeneralMessageType = require('../../../LU/Message Types/LUGeneralMessageType')
  .LUGeneralMessageType;
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const UserSessionInfo = require('../../../LU/Messages/UserSessionInfo');
const {
  DisconnectNotify,
  DisconnectNotifyReason
} = require('../../../LU/Messages/DisconnectNotify');
const Sequelize = require('sequelize');

const { Session, User } = require('../../../DB/LUJS');

function MSG_WORLD_CLIENT_VALIDATION (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_VALIDATION
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      const sessionInfo = new UserSessionInfo();
      sessionInfo.deserialize(packet);

      User.findOne({
        where: {
          username: sessionInfo.username
        }
      }).then(userDB => {
        if (userDB !== null) {
          const Op = Sequelize.Op;
          Session.findOne({
            where: {
              [Op.and]: [
                { user_id: userDB.id },
                { start_time: { [Op.lt]: new Date() } },
                { end_time: { [Op.gt]: new Date() } },
                { key: sessionInfo.key },
                { ip: user.address }
              ]
            }
          }).then(session => {
            if (session === null) {
              // We didn't find a valid session for this user... Time to disconnect them...
              const response = new DisconnectNotify(); // TODO: Investigate error...
              response.reason = DisconnectNotifyReason.INVALID_SESSION_KEY;

              const send = new BitStream();
              send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
              send.writeShort(LURemoteConnectionType.general);
              send.writeLong(LUGeneralMessageType.MSG_SERVER_DISCONNECT_NOTIFY);
              send.writeByte(0);
              response.serialize(send);
              client.send(send, Reliability.RELIABLE_ORDERED);
            } else {
              client.user_id = userDB.id;
              client.session = session;
              handler.emit(`user-authenticated-${user.address}-${user.port}`);
            }
          });
        } else {
          const response = new DisconnectNotify(); // TODO: Investigate error...
          response.reason = DisconnectNotifyReason.INVALID_SESSION_KEY;

          const send = new BitStream();
          send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
          send.writeShort(LURemoteConnectionType.general);
          send.writeLong(LUGeneralMessageType.MSG_SERVER_DISCONNECT_NOTIFY);
          send.writeByte(0);
          response.serialize(send);
          client.send(send, Reliability.RELIABLE_ORDERED);
        }
      });
    }
  );
}

module.exports = MSG_WORLD_CLIENT_VALIDATION;
