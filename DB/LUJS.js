const { Sequelize } = require('sequelize');
const config = require('config');

// Set up connection information
const sequelize = new Sequelize('lujs', null, null, {
  dialect: config.get('database.type'),
  operatorsAliases: false,
  storage: config.get('database.connection'),
  logging: false
});

// Test connection
sequelize.authenticate().then(function (err) {
  if (err) throw new Error('Unable to connect to the database:' + err);
  console.log('Connected to the LUJS database');
});

const models = {};

// import models
models.Ban = require('./Models/Ban')(sequelize);
models.Character = require('./Models/Character')(sequelize);
models.HardwareSurvey = require('./Models/HardwareSurvey')(sequelize);
models.InventoryItem = require('./Models/InventoryItem')(sequelize);
models.Session = require('./Models/Session')(sequelize);
models.User = require('./Models/User')(sequelize);

// relationships
models.Character.hasMany(models.InventoryItem, {
  as: 'Items',
  foreignKey: 'character_id',
  sourceKey: 'id'
});

models.sequelize = sequelize;

module.exports = models;
