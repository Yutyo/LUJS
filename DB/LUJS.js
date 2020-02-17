const {Sequelize} = require('sequelize');

const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);

module.exports = (config) => {
    // Set up connection information
    let sequelize = new Sequelize('lujs', null, null, {
        dialect: config.database.type,
        operatorsAliases: false,
        storage: config.database.connection,
        logging: false,
    });

    // Test connection
    sequelize.authenticate().then(function(err) {
        if (err) throw 'Unable to connect to the database:' + err;

        // Load up models
        return readdir(config.database.models)
    }).then(files => {
        let reqs = {};
        files.forEach((file) => {
            reqs[file.split('.')[0]] = require(config.database.models + file)(sequelize);
        });

        reqs.Character.hasMany(reqs.InventoryItem, {as: "Items", foreignKey: 'character_id', sourceKey: 'id'});
    });
};