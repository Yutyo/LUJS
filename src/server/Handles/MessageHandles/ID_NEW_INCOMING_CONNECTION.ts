import RakMessages from 'node-raknet/RakMessages';
import { RakServerExtended } from '../../Server';

/**
 *
 * @param {RakServerExtended} server
 */
export default function ID_NEW_INCOMING_CONNECTION(server: RakServerExtended) {
  server.on(String(RakMessages.ID_NEW_INCOMING_CONNECTION), function (
    packet,
    user
  ) {
    console.log(
      `Got new connection from ${user.address} for ${server.parent.ip}:${
        server.port
      }`
    );

    // prevent the server from shutting down
    clearTimeout(server.timeout);
  });
}
