import { Sequelize } from 'sequelize';
import * as config from 'config';

import ComponentsRegistryClass from './CDClient/ComponentsRegistry';
import ItemComponentClass from './CDClient/ItemComponent';
import ZoneTableClass from './CDClient/ZoneTable';

// Set up connection information
export const sequelize = new Sequelize('cdclient', null, null, {
  dialect: config.get('cdclient.type'),
  storage: config.get('cdclient.connection'),
  logging: false
});

// Test connection
sequelize.authenticate().then(function (err) {
  if (err) throw new Error('Unable to connect to the database:' + err);
  console.log('Connected to the CDClient database');
});

export const ComponentsRegistry = ComponentsRegistryClass(sequelize);
export const ItemComponent = ItemComponentClass(sequelize);
export const ZoneTable = ZoneTableClass(sequelize);
