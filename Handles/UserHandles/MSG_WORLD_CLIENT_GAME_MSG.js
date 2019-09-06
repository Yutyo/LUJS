const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');
const LUClientMessageType = require('../../LU/Message Types/LUClientMessageType');
const GameMessageKey = require('lugamemessages/GameMessages').GameMessageKey;
const LWOOBJID = require('../../LU/LWOOBJID');
const GameMessageFactory = require('../../LU/GameMessageFactory');

function MSG_WORLD_CLIENT_GAME_MSG(handler) {
    handler.on([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_GAME_MSG].join(), function (server, packet, user) {
        let client = server.getClient(user.address);
        let objectLow = packet.readLong();
        let objectHigh = packet.readLong();
        let targetID = new LWOOBJID(objectHigh, objectLow);
        let id = packet.readShort();

        console.log(`Game Message with ID ${GameMessageKey.key(id)}(${id.toString(16)}) for object ${new LWOOBJID(objectHigh, objectLow)}`);

        // TODO: route these to a game message manager as an event

        let gm = GameMessageFactory.generateMessageFromBitStream(id, packet);

        let obj = server.getServer().manager.getManager('replica').getObject(targetID);
        if(obj !== undefined) obj.emitGM(id, gm, client);
        else console.log(`Target not found ${objectLow}`);
    })
}

module.exports = MSG_WORLD_CLIENT_GAME_MSG;