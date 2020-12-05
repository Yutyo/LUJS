const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUAuthenticationMessageType = require('../../../LU/Message Types/LUAuthenticationMessageType')
  .LUAuthenticationMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const { LoginInfo, LoginCodes } = require('../../../LU/Messages/LoginInfo');
const bcrypt = require('bcryptjs');
const { Session, User, HardwareSurvey } = require('../../../DB/LUJS');
const { ServerManager } = require('../../ServerManager');
const util = require('util');
const bcryptHash = util.promisify(bcrypt.hash);

function rand (size) {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let ret = '';
  for (let i = 0; i < size; i++) {
    ret += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return ret;
}

function MSG_AUTH_LOGIN_REQUEST (handler) {
  handler.on(
    [
      LURemoteConnectionType.authentication,
      LUAuthenticationMessageType.MSG_AUTH_LOGIN_REQUEST
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      const username = packet.readWString();
      const password = packet.readWString(41);
      packet.readShort(); // language
      packet.readByte(); // unknown
      const processInformation = packet.readWString(256); // process information
      const graphicsInformation = packet.readWString(128); // graphics information
      const numberOfProcessors = packet.readLong(); // number of processors
      const processorType = packet.readShort(); // processor type
      const processorLevel = packet.readShort(); // processor level
      packet.readLong(); // unknown 2

      if (!packet.allRead()) {
        packet.readLong(); // os major
        packet.readLong(); // os minor
        packet.readLong(); // os build
        packet.readLong(); // os platform
      }

      HardwareSurvey.create({
        process_information: processInformation,
        graphics_information: graphicsInformation,
        number_of_processors: numberOfProcessors,
        processor_type: processorType,
        processor_level: processorLevel
      });

      User.findOne({
        where: { username: username }
      }).then(userModel => {
        const response = new LoginInfo();

        if (userModel === null) {
          // The user was not found
          response.code = LoginCodes.badUsername;
        } else {
          // This is how to generate passwords..
          bcryptHash(password, 10)
            .then(hash => {
              console.log(hash);
            })
            .catch(() => {
              console.error('Failed to generate password hash');
            });

          // TODO: make this async... smh
          if (bcrypt.compareSync(password, userModel.password)) {
            response.code = LoginCodes.success;

            // Find the world server acting as the char server
            ServerManager.request(0).then(server => {
              const redirect = server;
              response.redirectIP = redirect.ip;
              response.redirectPort = redirect.port;
              response.chatIP = redirect.ip;
              response.chatPort = redirect.port;
              response.altIP = redirect.ip;

              // Session stuff.
              // TODO: Check if the user already has a login from this ip, if so kill that session (and log out the other user logged in at some point)
              // TODO: Check to see if there is already an existing session for this user, if so, use it
              // TODO: Actually store this in the DB
              response.session = rand(32);
              const today = new Date();

              Session.create({
                key: response.session,
                start_time: today,
                end_time: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                ip: user.address,
                user_id: userModel.id
              });

              response.clientVersionMajor = 1;
              response.clientVersionCurrent = 10;
              response.clientVersionMinor = 64;
              response.localization = 'US';
              // TODO: Actually get this from the DB
              response.firstSubscription = false;
              // TODO: Actually get this from the DB
              response.freeToPlay = false;

              const send = new BitStream();
              send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
              send.writeShort(LURemoteConnectionType.client);
              send.writeLong(LUClientMessageType.LOGIN_RESPONSE);
              send.writeByte(0);
              response.serialize(send);
              client.send(send, Reliability.RELIABLE_ORDERED);
            });

            return;
          } else {
            response.code = LoginCodes.badPassword;
          }
        }

        response.clientVersionMajor = 1;
        response.clientVersionCurrent = 10;
        response.clientVersionMinor = 64;
        response.localization = 'US';
        // TODO: Actually get this from the DB
        response.firstSubscription = false;
        // TODO: Actually get this from the DB
        response.freeToPlay = false;

        const send = new BitStream();
        send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
        send.writeShort(LURemoteConnectionType.client);
        send.writeLong(LUClientMessageType.LOGIN_RESPONSE);
        send.writeByte(0);
        response.serialize(send);
        client.send(send, Reliability.RELIABLE_ORDERED);
      });
    }
  );
}

module.exports = MSG_AUTH_LOGIN_REQUEST;
