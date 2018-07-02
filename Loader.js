const RakServer = require('node-raknet/RakServer.js');
const Server = require('./Server');
const Log = require('./Log');
const fs = require('fs');
const path = require('path');

class Loader {
    static setup(config) {
        global.logLevel = config.logLevel;
        global.maps = config.mapsFolder;

        this.setupDatabase(config);
        this.setupCDClient(config);
        this.startServersFromConfig(config);
        this.addMessageHandles(config);

    }

    static startServersFromConfig(config) {
        // Load servers from config file...
        global.servers = [];
        config.servers.forEach(function(server) {
            global.servers.push(new Server(new RakServer(server.ip, server.port, server.password), server.zone));
        });

        // Add method to find zone to this server list
        global.servers.findZone = function(zoneID) {
            let ret = [];
            this.forEach(function(server) {
                if(server.zoneID === zoneID) {
                    ret.push(server);
                }
            });
            return ret;
        };
    }

    static addMessageHandles(config) {
        /**
         * Start dynamically adding modules for handling messages
         */
        let normalizedPath = path.join(__dirname, config.handlers);
        let handles = [];

        fs.readdirSync(normalizedPath).forEach(function(file) {
            handles.push(require(config.handlers + file));
        });

        global.servers.forEach(function(server) {
            handles.forEach(function(handle) {
                handle(server.rakServer);
            });
        });
    }

    static setupDatabase(config) {
        // Setting up ORM
        const Sequelize = require('sequelize');
        global.rebuildDB = config.database.rebuild;

        // Set up connection information
        global.sequelize = new Sequelize('lujs', null, null, {
            dialect: config.database.type,
            operatorsAliases: false,
            storage: config.database.connection,
            logging: false,
        });

        // Test connection
        sequelize.authenticate().then(function(err) {
            Log.info('Connection has been established successfully.');
        }, function (err) {
            Log.warn('Unable to connect to the database:', err);
        });

        // Load up models
        let modelsPath = path.join(__dirname, config.database.models);
        fs.readdirSync(modelsPath).forEach(function(file) {
            global[file.split('.')[0]] = (require(config.database.models + file));
        });
    }

    static setupCDClient(config) {
        // Setting up ORM
        const Sequelize = require('sequelize');

        // Set up connection information
        global.CDClient = new Sequelize('cdclient', null, null, {
            dialect: config.cdclient.type,
            operatorsAliases: false,
            storage: config.cdclient.connection,
            logging: false,
        });

        // Test connection
        CDClient.authenticate().then(function(err) {
            Log.info('Connection has been established successfully.');
        }, function (err) {
            Log.warn('Unable to connect to the database:', err);
        });

        // Load up models
        let modelsPath = path.join(__dirname, config.cdclient.models);
        fs.readdirSync(modelsPath).forEach(function(file) {
            global[file.split('.')[0]] = (require(config.cdclient.models + file));
        });
    }
}

module.exports = Loader;