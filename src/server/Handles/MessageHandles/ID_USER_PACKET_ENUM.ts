import RakMessages from 'node-raknet/RakMessages';
import { LURemoteConnectionType } from '../../../LU/Message Types/LURemoteConnectionType';
import { LUGeneralMessageType } from '../../../LU/Message Types/LUGeneralMessageType';
import { LUAuthenticationMessageType } from '../../../LU/Message Types/LUAuthenticationMessageType';
import { LUChatMessageType } from '../../../LU/Message Types/LUChatMessageType';
import { LUServerMessageType } from '../../../LU/Message Types/LUServerMessageType';
import { LUClientMessageType } from '../../../LU/Message Types/LUClientMessageType';
import { RakServerExtended } from '../../Server';
import * as path from 'path';
import * as fs from 'fs';

/**
 *
 * @param {RakServerExtended} server
 */
export default function ID_USER_PACKET_ENUM(server: RakServerExtended) {
  // Each module is responsible for registering for the event
  const normalizedPath = path.join(__dirname, '../UserHandles');
  fs.readdirSync(normalizedPath).forEach(function (file) {
    import('../UserHandles/' + file).then((handle) => {
      handle(server.userMessageHandler);
    });
  });

  server.on(String(RakMessages.ID_USER_PACKET_ENUM), function (packet, user) {
    const remoteConnectionType = packet.readShort();
    const packetID = packet.readLong();
    const alwaysZero = packet.readByte();
    if (alwaysZero !== 0) {
      throw new Error('Malformed Packet: Not always zero');
    }

    if (
      this.userMessageHandler.listenerCount(
        [remoteConnectionType, packetID].join()
      ) > 0
    ) {
      this.userMessageHandler.emit(
        [remoteConnectionType, packetID].join(),
        this,
        packet,
        user
      );
    } else {
      let string = '';
      switch (remoteConnectionType) {
        case LURemoteConnectionType.general:
          string = LUGeneralMessageType.key(packetID);
          break;
        case LURemoteConnectionType.client:
          string = LUClientMessageType.key(packetID);
          break;
        case LURemoteConnectionType.authentication:
          string = LUAuthenticationMessageType.key(packetID);
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
      console.log(
        `No listeners found for: ${[
          LURemoteConnectionType.key(remoteConnectionType),
          string
        ].join(', ')}`
      );
    }
  });
}
