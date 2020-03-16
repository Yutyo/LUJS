const RakServer = require('node-raknet/RakServer.js');
const Server = require('./Server');
const {servers, ServerManager} = require('./ServerManager');
const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');
const util = require('util');

const Commands = require('./Commands');

const readdir = util.promisify(fs.readdir);

const PluginLoader = require('./PluginLoader');

const config = require('config');

class Loader {
    static setup() {

        let loader = this;

        let normalizedPath = path.join(__dirname, config.get('handlers'));
        readdir(normalizedPath).then((files) => {
            let handles = [];
            files.forEach(function(file) {
                handles.push(require(config.get('handlers') + file));
            });

            loader.startServersFromConfig(handles);
        }).then(() => {
            Commands.instance();
            return PluginLoader.load(config, servers);
        });
    }

    static startServersFromConfig(handles) {
        config.get('servers').forEach(function(server) {
            ServerManager.startServer(server.ip, server.port, server.password, server.zone);
        });
    }
}

module.exports = Loader;