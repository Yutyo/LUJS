const { Sequelize } = require('sequelize');
const config = require('config');

// Set up connection information
const sequelize = new Sequelize('cdclient', null, null, {
  dialect: config.get('cdclient.type'),
  operatorsAliases: false,
  storage: config.get('cdclient.connection'),
  logging: false
});

// Test connection
sequelize.authenticate().then(function (err) {
  if (err) throw new Error('Unable to connect to the database:' + err);
  console.log('Connected to the CDClient database');
});

const models = {};

// import models
models.ComponentsRegistry = require('./CDClient/ComponentsRegistry')(sequelize);
models.ItemComponent = require('./CDClient/ItemComponent')(sequelize);
models.ZoneTable = require('./CDClient/ZoneTable')(sequelize);

// relationships

models.sequelize = sequelize;

module.exports = models;
