import GenericManager from './GenericManager';
import TransferToWorld from '../Messages/TransferToWorld';
import { LUClientMessageType } from '../Message Types/LUClientMessageType';
import { LURemoteConnectionType } from '../Message Types/LURemoteConnectionType';
import { Reliability } from 'node-raknet/ReliabilityLayer';
import BitStream from 'node-raknet/structures/BitStream';
import RakMessages from 'node-raknet/RakMessages';
import GameMessageFactory from '../GameMessageFactory';
import { GameMessageKey } from 'lugamemessages/GameMessages';
import { ServerManager } from '../../server/ServerManager';
import { Character } from '../../DB/LUJS';
import { Server } from '../../server/Server';

/**
 * A manager for basic chat functionality
 */
export default class ChatManager extends GenericManager {
  #commands;

  constructor(server: Server) {
    super(server);

    this.#commands = {};

    this.eventBus.on('chat', (message, client, sender) => {
      const text = message.properties.string;
      // if it is a command
      if (text.charAt(0) === '/') {
        // yay we get to parse it -_-
        const args = text.substr(1).split(' ');
        const command = args[0];

        if (this.#commands[command] === undefined) {
          // command doesn't exist
          console.log(`Command doesn't exist: ${command}`);
        } else {
          // TODO: permissions at some point
          this.#commands[command](sender, client, args);
        }
      } else {
        // TODO: Logic to broadcast to whole server
      }
    });

    // start adding basic commands?

    this.#commands.loc = () => {
      // loc doesn't do anything on server so we can just ignore it
    };

    // this is to change worlds
    this.#commands.testmap = (sender, client, args) => {
      Character.findByPk(client.session.character_id).then((character) => {
        ServerManager.request(parseInt(args[1])).then((server) => {
          const zone = server;

          character.x = zone.luz.spawnX;
          character.y = zone.luz.spawnY;
          character.z = zone.luz.spawnZ;
          character.rotation_x = zone.luz.spawnrX;
          character.rotation_y = zone.luz.spawnrY;
          character.rotation_z = zone.luz.spawnrZ;
          character.rotation_w = zone.luz.spawnrW;
          character.save();

          const response = new TransferToWorld();
          response.ip = zone.ip;
          response.port = zone.port;
          response.mythranShift = false;

          const send = new BitStream();
          send.writeByte(RakMessages.ID_USER_PACKET_ENUM);
          send.writeShort(LURemoteConnectionType.client);
          send.writeLong(LUClientMessageType.TRANSFER_TO_WORLD);
          send.writeByte(0);
          response.serialize(send);
          client.send(send, Reliability.RELIABLE_ORDERED);
        });
      });
    };

    this.#commands.fly = (sender, client, args) => {
      if (client.fly === undefined) client.fly = false;
      client.fly = !client.fly;

      const stream = new BitStream();
      stream.writeByte(RakMessages.ID_USER_PACKET_ENUM);
      stream.writeShort(LURemoteConnectionType.client);
      stream.writeLong(LUClientMessageType.GAME_MSG);
      stream.writeByte(0);
      stream.writeLongLong(
        0x1de0b6b500000000n + BigInt(client.session.character_id)
      );
      GameMessageFactory.makeMessage(GameMessageKey.setJetPackMode, {
        bypassChecks: true,
        use: client.fly,
        effectID: 0xa7
      }).serialize(stream);

      client.send(stream, Reliability.RELIABLE);
    };
  }
}
