const zlib = require('zlib');
const RakMessages = require('node-raknet/RakMessages.js');
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const LDF = require('../../../LU/LDF');
const GameMessageFactory = require('../../../LU/GameMessageFactory');
const GameMessageKey = require('lugamemessages/GameMessages').GameMessageKey;
const SerializationType = require('../../../LU/Replica/SerializationType');
const CharData = require('../../../LU/CharData');
const util = require('util');

const { Character } = require('../../../DB/LUJS');

const zlibDeflate = util.promisify(zlib.deflate);

function MSG_WORLD_CLIENT_LOGIN_REQUEST (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_LEVEL_LOAD_COMPLETE
    ].join(),
    (server, packet, user) => {
      const client = server.getClient(user.address);

      Character.findByPk(client.session.character_id).then(character => {
        const charData = new BitStream();
        charData.writeByte(RakMessages.ID_USER_PACKET_ENUM);
        charData.writeShort(LURemoteConnectionType.client);
        charData.writeLong(LUClientMessageType.CREATE_CHARACTER);
        charData.writeByte(0);

        const id = 0x1de0b6b500000000n + BigInt(character.id);
        const cont = new BitStream();
        const ldf = new LDF();
        ldf.addLWOOBJID('objid', id);
        ldf.addSignedLong('template', 1);

        const charDataXml = new CharData();
        charDataXml.setCharacterData(character.id, 0, 0, 0);
        charDataXml.setMinifigureData(
          character.hair_color,
          character.hair_style,
          character.shirt_color,
          character.pants_color,
          character.lh,
          character.rh,
          character.eyebrows,
          character.eyes,
          character.mouth
        );
        charDataXml.setLevelInformation(1);

        return character
          .getItems()
          .then(items => {
            items.forEach(item => {
              charDataXml.addItem(
                item.lot,
                (0x1000000100000000n + BigInt(item.id)).toString(),
                item.slot,
                item.count,
                item.is_equipped,
                item.is_linked
              );
            });
            ldf.addByteString('xmlData', charDataXml.xml.toString());

            console.log(charDataXml.xml.toString());
            ldf.serialize(cont);
          })
          .then(() => {
            return zlibDeflate(cont.data);
          })
          .then(buffer => {
            const compressedData = new BitStream(buffer);
            charData.writeLong(compressedData.length() + 9);
            charData.writeBoolean(true);
            charData.writeLong(cont.length());
            charData.writeLong(compressedData.length());
            charData.concat(compressedData);
            // charData.toFile((Date.now() / 1000 | 0) + "_chardata.bin");
            return client.send(charData, Reliability.RELIABLE_ORDERED);
          })
          .then(() => {
            const lwoobjid = new LWOOBJID(0x1de0b6b5, character.id);
            return server
              .getServer()
              .manager.getManager('replica')
              .loadObject(
                1,
                { x: character.x, y: character.y, z: character.z },
                {
                  x: character.rotation_x,
                  y: character.rotation_y,
                  z: character.rotation_z,
                  w: character.rotation_w
                },
                1,
                undefined,
                undefined,
                lwoobjid
              );
          })
          .then(object => {
            const characterManager = server
              .getServer()
              .manager.getManager('character');
            const charCompData = characterManager.getObjectData(object.ID);
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
              const inv = {
                inventory: []
              };
              items.forEach(item => {
                const invItem = {};
                invItem.id = 0x1000000100000000n + BigInt(item.id);
                invItem.lot = item.lot;
                invItem.count = item.count;
                invItem.slot = item.slot;

                inv.inventory.push(invItem);
              });

              const inventoryManager = server
                .getServer()
                .manager.getManager('inventory');
              inventoryManager.setObjectData(object.ID, inv);
              return object;
            });
          })
          .then(object => {
            const stream = new BitStream();
            stream.writeByte(RakMessages.ID_REPLICA_MANAGER_CONSTRUCTION);
            stream.writeBit(true);
            stream.writeShort(object.netID);
            object.serialize(SerializationType.CREATION, stream);

            // stream.toFile((Date.now() / 1000 | 0) + "_[24]_[01-00]_(1).bin");

            return client.send(stream, Reliability.RELIABLE).then(() => {
              return object;
            });
          })
          .then(object => {
            const stream = new BitStream();
            stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
            stream.writeShort(LURemoteConnectionType.client);
            stream.writeLong(LUClientMessageType.GAME_MSG);
            stream.writeByte(0);
            stream.writeLongLong(object.ID);
            GameMessageFactory.makeMessage(
              GameMessageKey.serverDoneLoadingAllObjects,
              {}
            ).serialize(stream);
            return client.send(stream, Reliability.RELIABLE).then(() => {
              return object;
            });
          })
          .then(object => {
            // attach the chat command listener to the player...
            object.addGMListener(
              GameMessageKey.parseChatMessage,
              (gm, user, obj) => {
                server.getServer().eventBus.emit('chat', gm, user, obj);
              }
            );

            object.addGMListener(
              GameMessageKey.playerLoaded,
              (gm, user, obj) => {
                const stream = new BitStream();
                stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
                stream.writeShort(LURemoteConnectionType.client);
                stream.writeLong(LUClientMessageType.GAME_MSG);
                stream.writeByte(0);
                object.ID.serialize(stream);
                GameMessageFactory.makeMessage(
                  GameMessageKey.playerReady,
                  {}
                ).serialize(stream);
                client.send(stream, Reliability.RELIABLE);
              }
            );
          });
      });
    }
  );
}

module.exports = MSG_WORLD_CLIENT_LOGIN_REQUEST;
