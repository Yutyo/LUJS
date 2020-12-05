const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../../LU/Message Types/LURemoteConnectionType')
  .LURemoteConnectionType;
const LUServerMessageType = require('../../../LU/Message Types/LUServerMessageType')
  .LUServerMessageType;
const LUClientMessageType = require('../../../LU/Message Types/LUClientMessageType')
  .LUClientMessageType;
const BitStream = require('node-raknet/structures/BitStream');
const { Reliability } = require('node-raknet/ReliabilityLayer.js');
const MinifigCreateRequest = require('../../../LU/Messages/MinifigCreateRequest');
const {
  MinifigCreateResponse,
  CreationResponse
} = require('../../../LU/Messages/MinifigCreateResponse');
const Sequelize = require('sequelize');

const { Character, InventoryItem } = require('../../../DB/LUJS');
const { ComponentsRegistry, ItemComponent } = require('../../../DB/CDClient');

function MSG_WORLD_CLIENT_CHARACTER_CREATE_REQUEST (handler) {
  handler.on(
    [
      LURemoteConnectionType.server,
      LUServerMessageType.MSG_WORLD_CLIENT_CHARACTER_CREATE_REQUEST
    ].join(),
    function (server, packet, user) {
      const client = server.getClient(user.address);

      const minifig = new MinifigCreateRequest();
      minifig.deserialize(packet);

      Character.create({
        name:
          minifig.firstName + ' ' + minifig.middleName + ' ' + minifig.lastName,
        unapproved_name: minifig.name,
        shirt_color: minifig.shirtColor,
        shirt_style: minifig.shirtStyle,
        pants_color: minifig.pantsColor,
        hair_style: minifig.hairStyle,
        hair_color: minifig.hairColor,
        lh: minifig.lh,
        rh: minifig.rh,
        eyebrows: minifig.eyebrows,
        eyes: minifig.eyes,
        mouth: minifig.mouth,
        user_id: client.user_id
      }).then(function (character) {
        const Op = Sequelize.Op;

        const promises = [];

        // Find the shirt...
        promises.push(
          ItemComponent.findOne({
            where: {
              [Op.and]: [
                { color1: minifig.shirtColor },
                { decal: minifig.shirtStyle },
                { equipLocation: 'chest' }
              ]
            }
          }).then(function (inventoryComponent) {
            promises.push(
              ComponentsRegistry.findOne({
                where: {
                  [Op.and]: [
                    { component_type: 11 },
                    { component_id: inventoryComponent.id }
                  ]
                }
              }).then(function (component) {
                InventoryItem.create({
                  character_id: character.id,
                  lot: component.id,
                  slot: 0,
                  count: 1,
                  type: 0,
                  is_equipped: 1,
                  is_linked: 1
                });
              })
            );
          })
        );

        // Find pants...
        promises.push(
          ItemComponent.findOne({
            where: {
              [Op.and]: [
                { color1: minifig.pantsColor },
                { equipLocation: 'legs' }
              ]
            }
          }).then(function (inventoryComponent) {
            promises.push(
              ComponentsRegistry.findOne({
                where: {
                  [Op.and]: [
                    { component_type: 11 },
                    { component_id: inventoryComponent.id }
                  ]
                }
              }).then(function (component) {
                InventoryItem.create({
                  character_id: character.id,
                  lot: component.id,
                  slot: 1,
                  count: 1,
                  type: 0,
                  is_equipped: 1,
                  is_linked: 1
                });
              })
            );
          })
        );

        Promise.all(promises).then(function () {
          const response = new MinifigCreateResponse();
          response.id = CreationResponse.SUCCESS;

          const send = new BitStream();
          send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
          send.writeShort(LURemoteConnectionType.client);
          send.writeLong(LUClientMessageType.CHARACTER_CREATE_RESPONSE);
          send.writeByte(0);
          response.serialize(send);
          client.send(send, Reliability.RELIABLE_ORDERED);

          // Send the minifig list again
          handler.emit(
            [
              LURemoteConnectionType.server,
              LUServerMessageType.MSG_WORLD_CLIENT_CHARACTER_LIST_REQUEST
            ].join(),
            server,
            undefined,
            user
          );
        });
      });
    }
  );
}

module.exports = MSG_WORLD_CLIENT_CHARACTER_CREATE_REQUEST;
