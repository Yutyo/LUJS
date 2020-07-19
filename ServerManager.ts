const config = require('config');
const util = require('util');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const readdir = util.promisify(fs.readdir);

import {Server, RakServerExtended} from './Server';

export const servers : Array<Server> = [];

const startPort = 3000;
// const poolSize = 5; TODO: use this
let currentPort = startPort;
const ip = config.globalIP;
const password = '3.25 ND';

export class ServerManager {
  /**
   *
   * @param {Server} server
   */
  static add (server) {
    servers.push(server);
  }

  /**
   *
   * @param ip
   * @param port
   * @param password
   * @param zoneID
   * @returns {Promise<Server>}
   */
  static startServer (ip, port, password, zoneID) {
    return new Promise(resolve => {
      const normalizedPath = path.join(__dirname, config.get('handlers'));
      readdir(normalizedPath)
        .then(files => {
          const handles = [];
          files.forEach(function (file) {
            handles.push(require(config.get('handlers') + file));
          });

          return handles;
        })
        .then(handles => {
          const rakServer = new RakServerExtended('0.0.0.0', port, password);

          rakServer.userMessageHandler = new EventEmitter();

          rakServer.server.on('listening', () => {
            handles.forEach(function (handle) {
              handle(rakServer);
            });
          });

          const server = new Server(rakServer, ip, port, zoneID);
          ServerManager.add(server);

          if (zoneID > 0) {
            server.loadLUZ(zoneID).then(() => {
              resolve(server);
            });
          } else {
            resolve(server);
          }
        });
    });
  }

  /**
   *
   * @param {Server} server
   */
  static remove (server) {
    let index = -1;
    servers.forEach((server_, i) => {
      if (server_.rakServer.port === server.rakServer.port) {
        index = i;
      }
    });

    servers[index].close().then(() => {
      servers.splice(index);
    });
  }

  /**
   * @param {Number} zoneID
   * @return {Promise<Server>}
   */
  static request (zoneID) {
    return new Promise((resolve, reject) => {
      // find an existing server
      for (const server of servers) {
        if (server.zoneID === zoneID) {
          resolve(server);
          return;
        }
      }

      // or start one
      this.startServer(ip, currentPort, password, zoneID).then(server => {
        resolve(server);
        currentPort++;
      });
    });
  }
}
