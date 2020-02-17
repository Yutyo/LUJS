const zlib = require('zlib');
const RakMessages = require('node-raknet/RakMessages.js');
const BitStream = require('node-raknet/BitStream');
const {ReliabilityLayer, Reliability} = require('node-raknet/ReliabilityLayer.js');
const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');
const LUClientMessageType = require('../../LU/Message Types/LUClientMessageType');
const LDF = require('../../LU/LDF');
const LWOOBJID = require('../../LU/LWOOBJID');
const GameMessageFactory = require('../../LU/GameMessageFactory');
const GameMessageKey = require('lugamemessages/GameMessages').GameMessageKey;
const SerializationType = require('../../LU/Replica/SerializationType');
const CharData = require('../../LU/CharData');
let promisify = require('util').promisify;

const {Character} = require('../../DB/LUJS');

const zlibDeflate = promisify(zlib.deflate);

function MSG_WORLD_CLIENT_LOGIN_REQUEST(handler) {
    handler.on([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_LEVEL_LOAD_COMPLETE].join(), (server, packet, user) => {
        let client = server.getClient(user.address);

        //TODO: At this point, this is where we start to send a few packets to the user.
        //TODO: We need to send the user as XML
        Character.findByPk(client.session.character_id).then(character => {
            let charData = new BitStream();
            charData.writeByte(RakMessages.ID_USER_PACKET_ENUM);
            charData.writeShort(LURemoteConnectionType.client);
            charData.writeLong(LUClientMessageType.CREATE_CHARACTER);
            charData.writeByte(0);

            let id = new LWOOBJID(0x1de0b6b5, character.id);
            let cont = new BitStream();
            let ldf = new LDF();
            ldf.addLWOOBJID("objid", id);
            ldf.addSignedLong("template", 1);

            let charDataXml = new CharData();
            charDataXml.setCharacterData(character.id, 0, 0, 0);
            charDataXml.setMinifigureData(character.hair_color, character.hair_style, character.shirt_color, character.pants_color, character.lh, character.rh, character.eyebrows, character.eyes, character.mouth);
            charDataXml.setLevelInformation(1);

            return character.getItems().then(items => {
                items.forEach(item => {
                    charDataXml.addItem(item.lot, new LWOOBJID(0x10000001, item.id).toString(), item.slot, item.count, item.is_equipped, item.is_linked);
                });
                ldf.addByteString("xmlData", charDataXml.xml.toString());

                console.log(charDataXml.xml.toString());
                ldf.serialize(cont);

            }).then(() => {
                return zlibDeflate(cont.data)
            }) .then((buffer) => {
                    let compressedData = new BitStream(buffer);
                    charData.writeLong(compressedData.length() + 9);
                    charData.writeBoolean(true);
                    charData.writeLong(cont.length());
                    charData.writeLong(compressedData.length());
                    charData.concat(compressedData);
                    charData.toFile((Date.now() / 1000 | 0) + "_chardata.bin");
                    return client.send(charData, Reliability.RELIABLE_ORDERED)
            }).then(() => {
                let lwoobjid = new LWOOBJID(0x1de0b6b5, character.id);
                return server.getServer().manager.getManager('replica').loadObject(
                    1,
                    {x: character.x, y: character.y, z: character.z},
                    {x: character.rotation_x, y: character.rotation_y, z: character.rotation_z, w: character.rotation_w},
                    1,
                    undefined,
                    undefined,
                    lwoobjid
                )
            }).then(object => {
                let characterManager = server.getServer().manager.getManager('character');
                let charCompData = characterManager.getObjectData(object.ID);
                charCompData.accountID = character.ID;
                charCompData.hairColor = character.hair_color;
                charCompData.hairStyle = character.hair_style;
                charCompData.shirtColor = character.shirt_color;
                charCompData.pantsColor = character.pants_color;
                charCompData.eyebrows = character.eyebrows;
                charCompData.eyes = character.eyes;
                charCompData.mouth = character.mouth;
                characterManager.setObjectData(object.ID, charCompData);

                return character.getItems().then(items => {
                    let inv = {
                        inventory: []
                    };
                    items.forEach(item => {
                        let inv_item = {};
                        inv_item.id = new LWOOBJID(0x10000001, item.id);
                        inv_item.lot = item.lot;
                        inv_item.count = item.count;
                        inv_item.slot = item.slot;

                        inv.inventory.push(inv_item);
                    });

                    let inventoryManager = server.getServer().manager.getManager('inventory');
                    inventoryManager.setObjectData(object.ID, inv);
                    return object
                });

            }).then(object => {
                let stream = new BitStream();
                stream.writeByte(RakMessages.ID_REPLICA_MANAGER_CONSTRUCTION);
                stream.writeBit(true);
                stream.writeShort(object.netID);
                object.serialize(SerializationType.CREATION, stream);

                stream.toFile((Date.now() / 1000 | 0) + "_[24]_[01-00]_(1).bin");

                return client.send(stream, Reliability.RELIABLE).then(() => {return object;});
            }).then((object) => {
                    let stream = new BitStream();
                    stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
                    stream.writeShort(LURemoteConnectionType.client);
                    stream.writeLong(LUClientMessageType.GAME_MSG);
                    stream.writeByte(0);
                    stream.writeLongLong(object.ID.high, object.ID.low);
                    GameMessageFactory.makeMessage(GameMessageKey.serverDoneLoadingAllObjects, {}).serialize(stream);
                    return client.send(stream, Reliability.RELIABLE).then(() => {return object;});
            }).then((object) => {
                // attach the chat command listener to the player...
                object.addGMListener(GameMessageKey.parseChatMessage, (gm, user, obj) => {
                    server.getServer().eventBus.emit('chat', gm, user, obj);
                });

                object.addGMListener(GameMessageKey.playerLoaded, (gm, user, obj) => {
                    let stream = new BitStream();
                    stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
                    stream.writeShort(LURemoteConnectionType.client);
                    stream.writeLong(LUClientMessageType.GAME_MSG);
                    stream.writeByte(0);
                    object.ID.serialize(stream);
                    GameMessageFactory.makeMessage(GameMessageKey.playerReady, {}).serialize(stream);
                    client.send(stream, Reliability.RELIABLE);
                });
            });
        });
    });
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;