GenericManager = require('./GenericManager');
const TransferToWorld = require('../Messages/TransferToWorld');
const LUClientMessageType = require('../Message Types/LUClientMessageType');
const LURemoteConnectionType = require('../Message Types/LURemoteConnectionType');
const {ReliabilityLayer, Reliability} = require('node-raknet/ReliabilityLayer.js');
const BitStream = require('node-raknet/BitStream');
const RakMessages = require('node-raknet/RakMessages.js');
const GameMessageFactory = require('../../LU/GameMessageFactory');
const GameMessageKey = require('lugamemessages/GameMessages').GameMessageKey;
const LWOOBJID = require('../../LU/LWOOBJID');

/**
 * A manager for basic chat functionality
 */
class ChatManager extends GenericManager {
    constructor(server) {
        super(server);

        this._commands = {};

        this.eventBus.on('chat', (message, client, sender) => {
            let text = message.properties.string;
            // if it is a command
            if(text.charAt(0) === "/") {
                // yay we get to parse it -_-
                let args = text.substr(1).split(' ');
                let command = args[0];

                if(this._commands[command] === undefined) {
                    // command doesn't exist
                    console.log(`Command doesn't exist: ${command}`);
                } else {
                    // TODO: permissions at some point
                    this._commands[command](sender, client, args);
                }
            } else {
                //TODO: Logic to broadcast to whole server
            }
        });

        // start adding basic commands?

        // loc doesn't do anything on server so we can just ignore it
        this._commands["loc"] = () => {};

        // this is to change worlds
        this._commands["testmap"] = (sender, client, args) => {
            Character.findByPk(client.session.character_id).then(character => {
                servers.findZone(parseInt(args[1])).then((servers) => {
                    let zone = servers[0];

                    character.x = zone.luz.spawnX;
                    character.y = zone.luz.spawnY;
                    character.z = zone.luz.spawnZ;
                    character.rotation_x = zone.luz.spawnrX;
                    character.rotation_y = zone.luz.spawnrY;
                    character.rotation_z = zone.luz.spawnrZ;
                    character.rotation_w = zone.luz.spawnrW;
                    character.save();

                    let response = new TransferToWorld();
                    response.ip = zone.rakServer.ip;
                    response.port = zone.rakServer.port;
                    response.mythranShift = false;

                    let send = new BitStream();
                    send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
                    send.writeShort(LURemoteConnectionType.client);
                    send.writeLong(LUClientMessageType.TRANSFER_TO_WORLD);
                    send.writeByte(0);
                    response.serialize(send);
                    client.send(send, Reliability.RELIABLE_ORDERED);
                });
            });
        };

        this._commands["fly"] = (sender, client, args) => {
            let stream = new BitStream();
            stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
            stream.writeShort(LURemoteConnectionType.client);
            stream.writeLong(LUClientMessageType.GAME_MSG);
            stream.writeByte(0);
            new LWOOBJID(0x1de0b6b5, client.session.character_id).serialize(stream);
            GameMessageFactory.makeMessage(GameMessageKey.setJetPackMode, {
                bypassChecks: true,
                use: true,
                effectID: 0xA7
            }).serialize(stream);

            console.log(stream.toBinaryString());

            client.send(stream, Reliability.RELIABLE);
        }
    }
}

module.exports = ChatManager;