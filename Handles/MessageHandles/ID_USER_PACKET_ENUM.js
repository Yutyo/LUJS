/**
 *
 * @type {{ID_INTERNAL_PING: number, ID_PING: number, ID_PING_OPEN_CONNECTIONS: number, ID_CONNECTED_PONG: number, ID_CONNECTION_REQUEST: number, ID_SECURED_CONNECTION_RESPONSE: number, ID_SECURED_CONNECTION_CONFIRMATION: number, ID_RPC_MAPPING: number, ID_DETECT_LOST_CONNECTIONS: number, ID_OPEN_CONNECTION_REQUEST: number, ID_OPEN_CONNECTION_REPLY: number, ID_RPC: number, ID_RPC_REPLY: number, ID_OUT_OF_BAND_INTERNAL: number, ID_CONNECTION_REQUEST_ACCEPTED: number, ID_CONNECTION_ATTEMPT_FAILED: number, ID_ALREADY_CONNECTED: number, ID_NEW_INCOMING_CONNECTION: number, ID_NO_FREE_INCOMING_CONNECTIONS: number, ID_DISCONNECTION_NOTIFICATION: number, ID_CONNECTION_LOST: number, ID_RSA_PUBLIC_KEY_MISMATCH: number, ID_CONNECTION_BANNED: number, ID_INVALID_PASSWORD: number, ID_MODIFIED_PACKET: number, ID_TIMESTAMP: number, ID_PONG: number, ID_ADVERTISE_SYSTEM: number, ID_REMOTE_DISCONNECTION_NOTIFICATION: number, ID_REMOTE_CONNECTION_LOST: number, ID_REMOTE_NEW_INCOMING_CONNECTION: number, ID_DOWNLOAD_PROGRESS: number, ID_FILE_LIST_TRANSFER_HEADER: number, ID_FILE_LIST_TRANSFER_FILE: number, ID_DDT_DOWNLOAD_REQUEST: number, ID_TRANSPORT_STRING: number, ID_REPLICA_MANAGER_CONSTRUCTION: number, ID_REPLICA_MANAGER_DESTRUCTION: number, ID_REPLICA_MANAGER_SCOPE_CHANGE: number, ID_REPLICA_MANAGER_SERIALIZE: number, ID_REPLICA_MANAGER_DOWNLOAD_STARTED: number, ID_REPLICA_MANAGER_DOWNLOAD_COMPLETE: number, ID_CONNECTION_GRAPH_REQUEST: number, ID_CONNECTION_GRAPH_REPLY: number, ID_CONNECTION_GRAPH_UPDATE: number, ID_CONNECTION_GRAPH_NEW_CONNECTION: number, ID_CONNECTION_GRAPH_CONNECTION_LOST: number, ID_CONNECTION_GRAPH_DISCONNECTION_NOTIFICATION: number, ID_ROUTE_AND_MULTICAST: number, ID_RAKVOICE_OPEN_CHANNEL_REQUEST: number, ID_RAKVOICE_OPEN_CHANNEL_REPLY: number, ID_RAKVOICE_CLOSE_CHANNEL: number, ID_RAKVOICE_DATA: number, ID_AUTOPATCHER_GET_CHANGELIST_SINCE_DATE: number, ID_AUTOPATCHER_CREATION_LIST: number, ID_AUTOPATCHER_DELETION_LIST: number, ID_AUTOPATCHER_GET_PATCH: number, ID_AUTOPATCHER_PATCH_LIST: number, ID_AUTOPATCHER_REPOSITORY_FATAL_ERROR: number, ID_AUTOPATCHER_FINISHED_INTERNAL: number, ID_AUTOPATCHER_FINISHED: number, ID_AUTOPATCHER_RESTART_APPLICATION: number, ID_NAT_PUNCHTHROUGH_REQUEST: number, ID_NAT_TARGET_NOT_CONNECTED: number, ID_NAT_TARGET_CONNECTION_LOST: number, ID_NAT_CONNECT_AT_TIME: number, ID_NAT_SEND_OFFLINE_MESSAGE_AT_TIME: number, ID_NAT_IN_PROGRESS: number, ID_DATABASE_QUERY_REQUEST: number, ID_DATABASE_UPDATE_ROW: number, ID_DATABASE_REMOVE_ROW: number, ID_DATABASE_QUERY_REPLY: number, ID_DATABASE_UNKNOWN_TABLE: number, ID_DATABASE_INCORRECT_PASSWORD: number, ID_READY_EVENT_SET: number, ID_READY_EVENT_UNSET: number, ID_READY_EVENT_ALL_SET: number, ID_READY_EVENT_QUERY: number, ID_LOBBY_GENERAL: number, ID_AUTO_RPC_CALL: number, ID_AUTO_RPC_REMOTE_INDEX: number, ID_AUTO_RPC_UNKNOWN_REMOTE_INDEX: number, ID_RPC_REMOTE_ERROR: number, ID_USER_PACKET_ENUM: number}}
 */
const RakMessages = require('node-raknet/RakMessages.js');
const BitStream = require('node-raknet/BitStream.js');
const LURemoteConnectionType = require('../../LU/Message Types/LURemoteConnectionType');
const LUGeneralMessageType = require('../../LU/Message Types/LUGeneralMessageType');
const LUAthenticationMessageType = require('../../LU/Message Types/LUAuthenticationMessageType');
const LUChatMessageType = require('../../LU/Message Types/LUChatMessageType');
const LUServerMessageType = require('../../Lu/Message Types/LUServerMessageType');
const LUClientMessageType = require('../../LU/Message Types/LUClientMessageType');
const Log = require('../../Log');

/**
 *
 * @param {RakServer} server
 */
function ID_USER_PACKET_ENUM(server) {

    // Each module is responsible for registering for the event
    let normalizedPath = require("path").join(__dirname, "../UserHandles");
    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        let handle = require("../UserHandles/" + file);
        handle(server.userMessageHandler);
    });

    server.on(String(RakMessages.ID_USER_PACKET_ENUM), function (packet, user) {
        let remoteConnectionType = packet.readShort();
        let packetID = packet.readLong();
        let alwaysZero = packet.readByte();
        if(this.userMessageHandler.listenerCount([remoteConnectionType,packetID].join()) > 0) {
            this.userMessageHandler.emit([remoteConnectionType,packetID].join(), this, packet, user);
        } else {
            let string = "";
            switch (remoteConnectionType) {
                case LURemoteConnectionType.general:
                    string = LUGeneralMessageType.key(packetID);
                    break;
                case LURemoteConnectionType.client:
                    string = LUClientMessageType.key(packetID);
                    break;
                case LURemoteConnectionType.authentication:
                    string = LUAthenticationMessageType.key(packetID);
                    break;
                case LURemoteConnectionType.chat:
                    string = LUChatMessageType.key(packetID);
                    break;
                case LURemoteConnectionType.server:
                    string = LUServerMessageType.key(packetID);
                    break;
                case LURemoteConnectionType.internal:
                    break;

            }
            Log.debug(`No listeners found for: ${[LURemoteConnectionType.key(remoteConnectionType),string].join(', ')}`);
        }
    });
}

module.exports = ID_USER_PACKET_ENUM;