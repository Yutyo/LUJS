/**
 *
 * @type {{ID_INTERNAL_PING: number, ID_PING: number, ID_PING_OPEN_CONNECTIONS: number, ID_CONNECTED_PONG: number, ID_CONNECTION_REQUEST: number, ID_SECURED_CONNECTION_RESPONSE: number, ID_SECURED_CONNECTION_CONFIRMATION: number, ID_RPC_MAPPING: number, ID_DETECT_LOST_CONNECTIONS: number, ID_OPEN_CONNECTION_REQUEST: number, ID_OPEN_CONNECTION_REPLY: number, ID_RPC: number, ID_RPC_REPLY: number, ID_OUT_OF_BAND_INTERNAL: number, ID_CONNECTION_REQUEST_ACCEPTED: number, ID_CONNECTION_ATTEMPT_FAILED: number, ID_ALREADY_CONNECTED: number, ID_NEW_INCOMING_CONNECTION: number, ID_NO_FREE_INCOMING_CONNECTIONS: number, ID_DISCONNECTION_NOTIFICATION: number, ID_CONNECTION_LOST: number, ID_RSA_PUBLIC_KEY_MISMATCH: number, ID_CONNECTION_BANNED: number, ID_INVALID_PASSWORD: number, ID_MODIFIED_PACKET: number, ID_TIMESTAMP: number, ID_PONG: number, ID_ADVERTISE_SYSTEM: number, ID_REMOTE_DISCONNECTION_NOTIFICATION: number, ID_REMOTE_CONNECTION_LOST: number, ID_REMOTE_NEW_INCOMING_CONNECTION: number, ID_DOWNLOAD_PROGRESS: number, ID_FILE_LIST_TRANSFER_HEADER: number, ID_FILE_LIST_TRANSFER_FILE: number, ID_DDT_DOWNLOAD_REQUEST: number, ID_TRANSPORT_STRING: number, ID_REPLICA_MANAGER_CONSTRUCTION: number, ID_REPLICA_MANAGER_DESTRUCTION: number, ID_REPLICA_MANAGER_SCOPE_CHANGE: number, ID_REPLICA_MANAGER_SERIALIZE: number, ID_REPLICA_MANAGER_DOWNLOAD_STARTED: number, ID_REPLICA_MANAGER_DOWNLOAD_COMPLETE: number, ID_CONNECTION_GRAPH_REQUEST: number, ID_CONNECTION_GRAPH_REPLY: number, ID_CONNECTION_GRAPH_UPDATE: number, ID_CONNECTION_GRAPH_NEW_CONNECTION: number, ID_CONNECTION_GRAPH_CONNECTION_LOST: number, ID_CONNECTION_GRAPH_DISCONNECTION_NOTIFICATION: number, ID_ROUTE_AND_MULTICAST: number, ID_RAKVOICE_OPEN_CHANNEL_REQUEST: number, ID_RAKVOICE_OPEN_CHANNEL_REPLY: number, ID_RAKVOICE_CLOSE_CHANNEL: number, ID_RAKVOICE_DATA: number, ID_AUTOPATCHER_GET_CHANGELIST_SINCE_DATE: number, ID_AUTOPATCHER_CREATION_LIST: number, ID_AUTOPATCHER_DELETION_LIST: number, ID_AUTOPATCHER_GET_PATCH: number, ID_AUTOPATCHER_PATCH_LIST: number, ID_AUTOPATCHER_REPOSITORY_FATAL_ERROR: number, ID_AUTOPATCHER_FINISHED_INTERNAL: number, ID_AUTOPATCHER_FINISHED: number, ID_AUTOPATCHER_RESTART_APPLICATION: number, ID_NAT_PUNCHTHROUGH_REQUEST: number, ID_NAT_TARGET_NOT_CONNECTED: number, ID_NAT_TARGET_CONNECTION_LOST: number, ID_NAT_CONNECT_AT_TIME: number, ID_NAT_SEND_OFFLINE_MESSAGE_AT_TIME: number, ID_NAT_IN_PROGRESS: number, ID_DATABASE_QUERY_REQUEST: number, ID_DATABASE_UPDATE_ROW: number, ID_DATABASE_REMOVE_ROW: number, ID_DATABASE_QUERY_REPLY: number, ID_DATABASE_UNKNOWN_TABLE: number, ID_DATABASE_INCORRECT_PASSWORD: number, ID_READY_EVENT_SET: number, ID_READY_EVENT_UNSET: number, ID_READY_EVENT_ALL_SET: number, ID_READY_EVENT_QUERY: number, ID_LOBBY_GENERAL: number, ID_AUTO_RPC_CALL: number, ID_AUTO_RPC_REMOTE_INDEX: number, ID_AUTO_RPC_UNKNOWN_REMOTE_INDEX: number, ID_RPC_REMOTE_ERROR: number, ID_USER_PACKET_ENUM: number}}
 */
const RakMessages = require('node-raknet/RakMessages.js');
const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUServerMessageType = require('../../LU/Message Types/LUServerMessageType');
const LUClientMessageType = require('../../LU/Message Types/LUClientMessageType');
const BitStream = require('node-raknet/BitStream');
const {ReliabilityLayer, Reliability} = require('node-raknet/ReliabilityLayer.js');
const MinifigCreateRequest = require('../../LU/Messages/MinifigCreateRequest');
const MinifigList = require('../../LU/Messages/MinifigList');
const {MinifigCreateResponse, CreationResponse} = require('../../LU/Messages/MinifigCreateResponse');
const Sequelize = require('sequelize');

const {Character, InventoryItem} = require('../../DB/LUJS');

function MSG_WORLD_CLIENT_CHARACTER_CREATE_REQUEST(handler) {
    handler.on([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_CHARACTER_CREATE_REQUEST].join(), function(server, packet, user) {
        let client = server.getClient(user.address);

        let minifig = new MinifigCreateRequest();
        minifig.deserialize(packet);

        Character.create({
            name: minifig.firstName + " " + minifig.middleName + " " + minifig.lastName,
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
        }).then(function(character) {

            const Op = Sequelize.Op;

            let promises = [];

            // Find the shirt...
            promises.push(ItemComponent.findOne({
                where: {
                    [Op.and]: [
                        {color1: minifig.shirtColor},
                        {decal: minifig.shirtStyle},
                        {equipLocation: "chest"}
                    ]
                }
            }).then(function(inventoryComponent) {
                promises.push(ComponentsRegistry.findOne({
                    where: {
                        [Op.and]: [
                            {component_type: 11},
                            {component_id: inventoryComponent.id}
                        ]
                    }
                }).then(function(component) {
                    InventoryItem.create({
                       character_id: character.id,
                        lot: component.id,
                        slot: 0,
                        count: 1,
                        type: 0,
                        is_equipped: 1,
                        is_linked: 1
                    });
                }));
            }));

            // Find pants...
            promises.push(ItemComponent.findOne({
                where: {
                    [Op.and]: [
                        {color1: minifig.pantsColor},
                        {equipLocation: "legs"}
                    ]
                }
            }).then(function(inventoryComponent) {
                promises.push(ComponentsRegistry.findOne({
                    where: {
                        [Op.and]: [
                            {component_type: 11},
                            {component_id: inventoryComponent.id}
                        ]
                    }
                }).then(function(component) {
                    InventoryItem.create({
                        character_id: character.id,
                        lot: component.id,
                        slot: 1,
                        count: 1,
                        type: 0,
                        is_equipped: 1,
                        is_linked: 1
                    });
                }));
            }));

            Promise.all(promises).then(function() {
                let response = new MinifigCreateResponse();
                response.id = CreationResponse.SUCCESS;

                let send = new BitStream();
                send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
                send.writeShort(LURemoteConnectionType.client);
                send.writeLong(LUClientMessageType.CHARACTER_CREATE_RESPONSE);
                send.writeByte(0);
                response.serialize(send);
                client.send(send, Reliability.RELIABLE_ORDERED);

                // Send the minifig list again
                handler.emit([LURemoteConnectionType.server, LUServerMessageType.MSG_WORLD_CLIENT_CHARACTER_LIST_REQUEST].join(), server, undefined, user);
            });


        });
    });
}

module.exports = MSG_WORLD_CLIENT_CHARACTER_CREATE_REQUEST;