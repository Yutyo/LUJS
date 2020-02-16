const RakServer = require('node-raknet/RakServer.js');
const Server = require('./Server');
const Log = require('./Log');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const util = require('util');

const readdir = util.promisify(fs.readdir);


const PluginLoader = require('./PluginLoader');

let config;

class Loader {
    static setup(inConfig) {
        config = inConfig;

        global.logLevel = config.logLevel;
        global.maps = config.mapsFolder;

        let loader = this;




        this.setupDatabase().then(() => {
            return loader.setupCDClient()
        }).then(() => {
            let normalizedPath = path.join(__dirname, config.handlers);
            return readdir(normalizedPath)
        }).then((files) => {
            let handles = [];
            files.forEach(function(file) {
                handles.push(require(config.handlers + file));
            });

            loader.startServersFromConfig(handles);
        }).then(() => {
            return PluginLoader.load(config, global.servers);
        });
    }

    static startServersFromConfig(handles) {
        // Load servers from config file...
        global.servers = [];
        global.serverPort = 3000;

        config.servers.forEach(function(server) {
            let rakServer = new RakServer(server.ip, server.port, server.password);

            rakServer.server.on('listening', () => {
                handles.forEach(function(handle) {
                    handle(rakServer);
                });
            });

            global.servers.push(new Server(rakServer, server.zone));
        });

        // Add method to find zone to this server list
        global.servers.findZone = function(zoneID) {
            return new Promise((resolve, reject) => {
                let ret = [];
                global.servers.forEach(function(server) {
                    if(server.zoneID === zoneID) {
                        ret.push(server);
                    }
                });

                resolve(ret);
            });
        };
    }

    static setupDatabase() {
        // Setting up ORM
        global.rebuildDB = config.database.rebuild;

        if(config.database.rebuild) {
            Log.info('Rebuilding the database');
            config.database.rebuild = false;
            fs.writeFile('config.json', JSON.stringify(config, null, 4), (err) => {
                if(err) throw err;
            });
        }

        // Set up connection information
        global.sequelize = new Sequelize('lujs', null, null, {
            dialect: config.database.type,
            operatorsAliases: false,
            storage: config.database.connection,
            logging: false,
        });

        // Test connection
        return sequelize.authenticate().then(function(err) {
            if(err) throw 'Unable to connect to the database:' + err;
            Log.info('Connected to LUJS DB');

            // Load up models
            let modelsPath = path.join(__dirname, config.database.models);
            fs.readdirSync(modelsPath).forEach(function(file) {
                global[file.split('.')[0]] = (require(config.database.models + file));
            });
        });
    }

    static setupCDClient() {
        // Set up connection information
        global.CDClient = new Sequelize('cdclient', null, null, {
            dialect: config.cdclient.type,
            operatorsAliases: false,
            storage: config.cdclient.connection,
            logging: false,
        });

        // Test connection
        return CDClient.authenticate().then(function(err) {
            if(err) throw 'Unable to connect to the database:' + err;

            Log.info('Connected to CDClient DB');

            // Load up models
            let modelsPath = path.join(__dirname, config.cdclient.models);
            fs.readdirSync(modelsPath).forEach(function(file) {
                global[file.split('.')[0]] = (require(config.cdclient.models + file));
            });
        });
    }
}

module.exports = Loader;