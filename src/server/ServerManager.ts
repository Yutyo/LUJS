import * as config from 'config';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as events from 'events';
import { Server, RakServerExtended } from './Server';

const readdir = util.promisify(fs.readdir);

export const servers: Array<Server> = [];

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
  static add(server) {
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
  static startServer(
    ip: string,
    port: number,
    password: string,
    zoneID: number
  ): Promise<Server> {
    return new Promise((resolve) => {
      const normalizedPath = path.join(__dirname, config.get('handlers'));
      readdir(normalizedPath)
        .then((files) => {
          const handles = [];
          files.forEach(function (file) {
            if(file.split('.')[file.split('.').length - 1] !== 'js') return;

            import(config.get('handlers') + file).then((handle) => {
              handles.push(handle.default);
            });
          });

          return handles;
        })
        .then((handles) => {
          const rakServer = new RakServerExtended('0.0.0.0', port, password);

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
  static remove(server: Server): void {
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
  static request(zoneID: number): Promise<Server> {
    return new Promise((resolve, reject) => {
      // find an existing server
      for (const server of servers) {
        if (server.zoneID === zoneID) {
          resolve(server);
          return;
        }
      }

      // or start one
      this.startServer(ip, currentPort, password, zoneID).then((server) => {
        resolve(server);
        currentPort++;
      });
    });
  }
}
