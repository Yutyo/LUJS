const {Sequelize} = require('sequelize');

// Set up connection information
let sequelize = new Sequelize('lujs', null, null, {
    dialect: database.type,
    operatorsAliases: false,
    storage: database.connection,
    logging: false,
});

let models = {};

// Test connection
sequelize.authenticate().then(function(err) {
    if (err) throw 'Unable to connect to the database:' + err;
    console.log("Connected to the LUJS database");
});

// import models
models.Ban = require('./Models/Ban')(sequelize);
models.Character = require('./Models/Character')(sequelize);
models.HardwareSurvey = require('./Models/HardwareSurvey')(sequelize);
models.InventoryItem = require('./Models/InventoryItem')(sequelize);
models.Session = require('./Models/Session')(sequelize);
models.User = require('./Models/User')(sequelize);

// relationships
models.Character.hasMany(models.InventoryItem, {as: "Items", foreignKey: 'character_id', sourceKey: 'id'});

models.sequelize = sequelize;

module.exports = models;