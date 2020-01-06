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

            character.getItems().then(items => {
                items.forEach(item => {
                    charDataXml.addItem(item.lot, new LWOOBJID(0x10000001, item.id).toString(), item.slot, item.count, item.is_equipped, item.is_linked);
                });
                ldf.addByteString("xmlData", '<obj v="1"> <mf hc="7" hs="7" hd="0" t="11" l="84" hdc="0" cd="24" lh="31894544" rh="31447236" es="24" ess="17" ms="28" /> <char acct="5" cc="0" gm="0" ft="0" llog="1577671666" ls="0" lzx="-626.5847" lzy="613.3515" lzz="-28.6374" lzrx="0.0" lzry="0.7015" lzrz="0.0" lzrw="0.7126" /> <dest hm="4" hc="4" im="0" ic="0" am="0" ac="0" d="0" /> <inv> <bag> <b t="0" m="20" /> <b t="1" m="240" /> <b t="2" m="240" /> <b t="3" m="240" /> </bag> <items> <in t="0"> <i l="4260" id="1152921508901814281" s="0" c="1" eq="1" b="1" /> <i l="2513" id="1152921508901814282" s="1" c="1" eq="1" b="1" /> </in> </items> </inv> <lvl l="1" cv="1" sb="500" /> </obj>');

                //ldf.addByteString('xmlData', charDataXml.xml.toString());

                console.log(charDataXml.xml.toString());

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

                    charData.toFile((Date.now() / 1000 | 0) + "_chardata.bin");

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
                                            inv_item.id = new LWOOBJID(0x10000001, item.id);
                                            inv_item.lot = item.lot;
                                            inv_item.count = item.count;
                                            inv_item.slot = item.slot;

                                            inv.inventory.push(inv_item);
                                        });

                                        let inventoryManager = server.getServer().manager.getManager('inventory');
                                        inventoryManager.setObjectData(object.ID, inv);
                                    }).then(() => {
                                        let stream = new BitStream();
                                        stream.writeByte(RakMessages.ID_REPLICA_MANAGER_CONSTRUCTION);
                                        stream.writeBit(true);
                                        stream.writeShort(object.netID);
                                        object.serialize(SerializationType.CREATION, stream);

                                        //stream.toFile((Date.now() / 1000 | 0) + "_[24]_[01-00]_(1).bin");

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
            });

        }).then(() => {

        });
    });
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;