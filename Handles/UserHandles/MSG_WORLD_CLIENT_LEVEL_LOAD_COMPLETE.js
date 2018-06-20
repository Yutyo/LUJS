const RakMessages = require('node-raknet/RakMessages.js');
const BitStream = require('node-raknet/BitStream');
const {ReliabilityLayer, Reliability} = require('node-raknet/ReliabilityLayer.js');
const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');
const LUClientMessageType = require('../../LU/Message Types/LUClientMessageType');
const TransferToWorld = require('../../LU/Messages/TransferToWorld');

function MSG_WORLD_CLIENT_LOGIN_REQUEST(handler) {
    handler.on([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_LEVEL_LOAD_COMPLETE].join(), function(server, packet, user) {
        let client = server.getClient(user.address);

        //TODO: At this point, this is where we start to send a few packets to the user.
        //TODO: We need to send the user as XML
        //TODO: We need to send the construction of all objects in a world

    });
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;