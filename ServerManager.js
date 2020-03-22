const config = require('config');
const util = require('util');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');
const RakServer = require('node-raknet/RakServer.js');

const readdir = util.promisify(fs.readdir);

const Server = require('./Server');

/**
 *
 * @type {Server[]}
 */
let servers = [];

const startPort = 3000;
const poolSize = 5;
let currentPort = startPort;
const ip = "127.0.0.1";
const password = "3.25 ND";

class ServerManager {

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
    static startServer(ip, port, password, zoneID) {
        return new Promise((resolve) => {
            let normalizedPath = path.join(__dirname, config.get('handlers'));
            readdir(normalizedPath).then((files) => {
                let handles = [];
                files.forEach(function(file) {
                    handles.push(require(config.get('handlers') + file));
                });

                return handles;
            }).then(handles => {
                let rakServer = new RakServer(ip, port, password);

                rakServer.userMessageHandler = new EventEmitter();

                rakServer.server.on('listening', () => {
                    handles.forEach(function(handle) {
                        handle(rakServer);
                    });
                });

                const ServerClass = require('./Server');
                let server = new ServerClass(rakServer, zoneID);
                ServerManager.add(server);

                if(zoneID > 0) {
                    server.loadLUZ(zoneID).then(() =>{
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
    static remove(server) {
        let index = -1;
        servers.forEach((server_, i) => {
            if(server_.rakServer.port === server.rakServer.port) {
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
    static request(zoneID) {
        return new Promise((resolve, reject) => {
            // find an existing server
            for(const server of servers) {
                if(server.zoneID === zoneID) {
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

module.exports = {servers, ServerManager};