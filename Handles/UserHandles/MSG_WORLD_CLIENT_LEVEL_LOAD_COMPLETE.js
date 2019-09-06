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
            ldf.serialize(cont);

            zlib.deflate(cont.data, (err, buffer) => {
                if(err) {
                    console.log(err.message);
                }

                let compressedData = new BitStream(buffer);
                charData.writeLong(compressedData.length() + 9);
                charData.writeBoolean(true);
                charData.writeLong(cont.length());
                charData.writeLong(compressedData.length());
                charData.concat(compressedData);

                //charData.toFile((Date.now() / 1000 | 0) + "_[53-05-00-04].bin");

                client.send(charData, Reliability.RELIABLE_ORDERED, () => {
                    Character.findByPk(client.session.character_id).then(character => {
                        let lwoobjid = new LWOOBJID(0x1de0b6b5, character.id);
                        server.getServer().manager.getManager('replica').loadObject(
                            1,
                            {x: character.x, y: character.y, z: character.z},
                            {x: character.rotation_x, y: character.rotation_y, z: character.rotation_z, w: character.rotation_w},
                            1,
                            undefined,
                            undefined,
                            lwoobjid,
                            (object) => {

                                // set character data
                                let characterManager = server.getServer().manager.getManager('character');
                                let charCompData = characterManager.getObjectData(object.ID);
                                charCompData.accountID = object.ID;
                                charCompData.hairColor = character.hair_color;
                                charCompData.hairStyle = character.hair_style;
                                charCompData.shirtColor = character.shirt_color;
                                charCompData.pantsColor = character.pants_color;
                                charCompData.eyebrows = character.eyebrows;
                                charCompData.eyes = character.eyes;
                                charCompData.mouth = character.mouth;
                                characterManager.setObjectData(object.ID, charCompData);

                                let itemsPromise = character.getItems().then(items => {
                                    let inv = {
                                        inventory: []
                                    };
                                    items.forEach(item => {
                                        let inv_item = {};
                                        inv_item.id = new LWOOBJID(0x1de0b6b6, id);
                                        inv_item.lot = item.lot;
                                        inv_item.count = item.count;
                                        inv_item.slot = item.slot;

                                        inv.inventory.push(item);
                                    });

                                    let inventoryManager = server.getServer().manager.getManager('inventory');
                                    inventoryManager.setObjectData(object.ID, inv);
                                }).then(() => {
                                    let stream = new BitStream();
                                    stream.writeByte(RakMessages.ID_REPLICA_MANAGER_CONSTRUCTION);
                                    stream.writeBit(true);
                                    stream.writeShort(object.netID);
                                    object.serialize(SerializationType.CREATION, stream);
                                    client.send(stream, Reliability.RELIABLE, () => {
                                        let stream = new BitStream();
                                        stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
                                        stream.writeShort(LURemoteConnectionType.client);
                                        stream.writeLong(LUClientMessageType.GAME_MSG);
                                        stream.writeByte(0);
                                        stream.writeLongLong(lwoobjid.high, lwoobjid.low);
                                        GameMessageFactory.makeMessage(GameMessageKey.serverDoneLoadingAllObjects, {}).serialize(stream);
                                        client.send(stream, Reliability.RELIABLE);
                                    });

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
                                        stream.writeLongLong(lwoobjid.high, lwoobjid.low);
                                        GameMessageFactory.makeMessage(GameMessageKey.playerReady, {}).serialize(stream);
                                        client.send(stream, Reliability.RELIABLE);
                                    });
                                });
                            }
                        );
                    });
                });
            });
        }).then(() => {

        });
    });
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;