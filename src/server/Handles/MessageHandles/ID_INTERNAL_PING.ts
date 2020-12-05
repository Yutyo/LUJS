import RakMessages from 'node-raknet/RakMessages';
import BitStream from 'node-raknet/structures/BitStream';
import { Reliability } from 'node-raknet/ReliabilityLayer';
import { RakServerExtended } from '../../Server';

/**
 *
 * @param {RakServerExtended} server
 */
export default function ID_INTERNAL_PING(server: RakServerExtended) {
  server.on(String(RakMessages.ID_INTERNAL_PING), function (packet, user) {
    const client = this.getClient(user.address);
    const ping = packet.readLong();

    const response = new BitStream();
    response.writeByte(RakMessages.ID_CONNECTED_PONG);
    response.writeLong(ping);
    response.writeLong(Date.now() - this.startTime);
    client.send(response, Reliability.UNRELIABLE);
  });
}
