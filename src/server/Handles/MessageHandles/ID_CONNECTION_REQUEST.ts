import RakMessages from 'node-raknet/RakMessages';
import BitStream from 'node-raknet/structures/BitStream';
import * as inetAton from 'inet-aton';
import { Reliability } from 'node-raknet/ReliabilityLayer';
import { RakServerExtended } from '../../Server';

/**
 *
 * @param {RakServerExtended} server
 */
export default function ID_CONNECTION_REQUEST(server: RakServerExtended) {
  server.on(String(RakMessages.ID_CONNECTION_REQUEST), function (packet, user) {
    const client = this.getClient(user.address);
    let password = '';
    while (!packet.allRead()) {
      password += String.fromCharCode(packet.readByte());
    }

    if (password === this.password) {
      const response = new BitStream();
      response.writeByte(RakMessages.ID_CONNECTION_REQUEST_ACCEPTED);

      const remoteAddress = inetAton(user.address);
      response.writeByte(remoteAddress[0]);
      response.writeByte(remoteAddress[1]);
      response.writeByte(remoteAddress[2]);
      response.writeByte(remoteAddress[3]);

      response.writeShort(user.port);
      response.writeShort(0);

      const localAddress = inetAton(this.ip);
      response.writeByte(localAddress[0]);
      response.writeByte(localAddress[1]);
      response.writeByte(localAddress[2]);
      response.writeByte(localAddress[3]);

      response.writeShort(this.server.address().port);
      client.send(response, Reliability.RELIABLE);
    }
  });
}
