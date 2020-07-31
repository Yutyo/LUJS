import RakMessages from 'node-raknet/RakMessages';
import { ServerManager } from '../../ServerManager';
import * as config from 'config';
import { RakServerExtended } from '../../Server';

/**
 *
 * @param {RakServerExtended} server
 */
export default function ID_DISCONNECTION_NOTIFICATION(
  server: RakServerExtended
) {
  server.on(String(RakMessages.ID_DISCONNECTION_NOTIFICATION), function (
    packet,
    user
  ) {
    console.log(
      `Client ${user.address} has disconnected from ${server.parent.ip}:${
        server.port
      }`
    );

    server.userMessageHandler.removeAllListeners(
      `user-authenticated-${user.address}-${user.port}`
    );

    // TODO: Save users info from memory to DB here...

    const servers = [];
    config.servers.forEach((server_) => {
      servers.push(server_.port);
    });

    if (server.connections.length === 0 && !servers.includes(server.port)) {
      // if the server is now empty
      server.timeout = setTimeout(() => {
        console.log(`Closing server ${server.port}`);

        ServerManager.remove(server.parent);
      }, config.timeout);
    }
  });
}
