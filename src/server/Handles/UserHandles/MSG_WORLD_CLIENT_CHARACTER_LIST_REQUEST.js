const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const MinifigList = require('../../../LU/Messages/MinifigList');
const Sequelize = require('sequelize');

const { Character, InventoryItem } = require('../../../DB/LUJS');

function MSG_WORLD_CLIENT_CHARACTER_LIST_REQUEST (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_CHARACTER_LIST_REQUEST
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      const list = function () {
        const Op = Sequelize.Op;

        Character.findAll({
          where: {
            user_id: client.user_id
          }
        }).then(characters => {
          const promises = [];
          const response = new MinifigList();
          characters.forEach(function (character) {
            const id = 0x1de0b6b500000000n + BigInt(character.id);
            const char = {
              id: id,
              unknown1: 0,
              name: character.name,
              unapprovedName: character.unapproved_name,
              nameRejected: false,
              freeToPlay: false,
              unknown2: '',
              shirtColor: character.shirt_color,
              shirtStyle: character.shirt_style,
              pantsColor: character.pants_color,
              hairStyle: character.hair_style,
              hairColor: character.hair_color,
              lh: character.lh,
              rh: character.rh,
              eyebrows: character.eyebrows,
              eyes: character.eyes,
              mouth: character.mouth,
              unknown3: 0,
              zone: character.zone,
              instance: character.instance,
              clone: character.clone,
              last_log: character.last_log,
              items: []
            };

            promises.push(
              InventoryItem.findAll({
                where: {
                  [Op.and]: [
                    { character_id: character.id },
                    { is_equipped: true }
                  ]
                }
              }).then(function (items) {
                items.forEach(function (item) {
                  char.items.push(item.lot);
                });
                response.characters.push(char);
              })
            );
          });
          Promise.all(promises).then(function () {
            const send = new BitStream();
            send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
            send.writeShort(LURemoteConnectionType.client);
            send.writeLong(LUClientMessageType.CHARACTER_LIST_RESPONSE);
            send.writeByte(0);
            response.serialize(send);
            client.send(send, Reliability.RELIABLE_ORDERED);
          });
        });
      };

      handler.on(`user-authenticated-${user.address}-${user.port}`, list);
    }
  );
}

module.exports = MSG_WORLD_CLIENT_CHARACTER_LIST_REQUEST;
