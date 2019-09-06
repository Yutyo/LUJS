const RakServer = require('node-raknet/RakServer.js');
const Server = require('./Server');
const Log = require('./Log');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

class Loader {
    static setup(config) {
        global.logLevel = config.logLevel;
        global.maps = config.mapsFolder;

        let loader = this;

        this.setupDatabase(config, () => {
            loader.setupCDClient(config, () => {
                let handles = [];
                let normalizedPath = path.join(__dirname, config.handlers);
                fs.readdirSync(normalizedPath).forEach(function(file) {
                    handles.push(require(config.handlers + file));
                });

                loader.startServersFromConfig(config, (rakserver) => {
                    handles.forEach(function(handle) {
                        handle(rakserver);
                    });
                });
            });
        });
    }

    static startServersFromConfig(config, callback) {
        // Load servers from config file...
        global.servers = [];
        global.serverPort = 3000;

        config.servers.forEach(function(server) {
            global.servers.push(new Server(new RakServer(server.ip, server.port, server.password, callback), server.zone));
        });

        // Add method to find zone to this server list
        global.servers.findZone = function(zoneID) {
            let ret = [];
            this.forEach(function(server) {
                if(server.zoneID === zoneID) {
                    ret.push(server);
                }
            });

            return new Promise((resolve, reject) => {
                resolve(ret);
            });
        };
    }

    static setupDatabase(config, callback) {
        // Setting up ORM
        global.rebuildDB = config.database.rebuild;

        if(config.database.rebuild) {
            Log.info('Rebuilding the database');
            config.database.rebuild = false;
            fs.writeFile('config.json', JSON.stringify(config, null, 4));
        }

        // Set up connection information
        global.sequelize = new Sequelize('lujs', null, null, {
            dialect: config.database.type,
            operatorsAliases: false,
            storage: config.database.connection,
            logging: false,
        });

        // Test connection
        sequelize.authenticate().then(function(err) {
            Log.info('Connected to LUJS DB');

            // Load up models
            let modelsPath = path.join(__dirname, config.database.models);
            fs.readdirSync(modelsPath).forEach(function(file) {
                global[file.split('.')[0]] = (require(config.database.models + file));
            });

            callback();
        }, function (err) {
            Log.warn('Unable to connect to the database:', err);
        });


    }

    static setupCDClient(config, callback) {
        // Set up connection information
        global.CDClient = new Sequelize('cdclient', null, null, {
            dialect: config.cdclient.type,
            operatorsAliases: false,
            storage: config.cdclient.connection,
            logging: false,
        });

        // Test connection
        CDClient.authenticate().then(function(err) {
            Log.info('Connected to CDClient DB');

            // Load up models
            let modelsPath = path.join(__dirname, config.cdclient.models);
            fs.readdirSync(modelsPath).forEach(function(file) {
                global[file.split('.')[0]] = (require(config.cdclient.models + file));
            });

            callback();
        }, function (err) {
            Log.warn('Unable to connect to the database:', err);
        });
    }
}

module.exports = Loader;