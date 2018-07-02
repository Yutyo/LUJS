const RakMessages = require('node-raknet/RakMessages.js');
const BitStream = require('node-raknet/BitStream');
const {ReliabilityLayer, Reliability} = require('node-raknet/ReliabilityLayer.js');
const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');
const LUClientMessageType = require('../../LU/Message Types/LUClientMessageType');
const LDF = require('../../LU/LDF');
const LWOOBJID = require('../../LU/LWOOBJID');

function MSG_WORLD_CLIENT_LOGIN_REQUEST(handler) {
    handler.on([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_LEVEL_LOAD_COMPLETE].join(), function(server, packet, user) {
        let client = server.getClient(user.address);

        //TODO: At this point, this is where we start to send a few packets to the user.
        //TODO: We need to send the user as XML
        Character.findById(client.session.character_id).then(character => {
            let charData = new BitStream();
            charData.writeByte(RakMessages.ID_USER_PACKET_ENUM);
            charData.writeShort(LURemoteConnectionType.client);
            charData.writeLong(LUClientMessageType.CREATE_CHARACTER);
            charData.writeByte(0);
            charData.writeLong(45);

            let id = new LWOOBJID(0x1de0b6b5, character.id);
            let cont = new BitStream();
            cont.writeBoolean(false);
            let ldf = new LDF();
            ldf.addLWOOBJID("objid", id);
            ldf.addSignedLong("template", 1);
            ldf.serialize(cont);
            charData.writeLong(cont.length());
            charData.writeBitStream(cont);

            client.send(charData, Reliability.RELIABLE_ORDERED);
        });
    });

    handler.on([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_LEVEL_LOAD_COMPLETE].join(), function(server, packet, user) {
        let client = server.getClient(user.address);

        //TODO: We need to construct the player
        Character.findById(client.session.character_id).then(character => {
            server.getServer().manager.getManager('replica').loadObject(1,
                {x: character.x, y: character.y, z: character.z},
                {x: character.rotation_x, y: character.rotation_y, z: character.rotation_z, w: character.rotation_w},
                1,
                undefined,
                undefined,
                new LWOOBJID(0x1de0b6b5, character.id)
            );
        });
    });
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;