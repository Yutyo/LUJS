import { Sequelize } from 'sequelize';
import * as config from 'config';

import BanClass from './Models/Ban';
import CharacterClass from './Models/Character';
import HardwareSurveyClass from './Models/HardwareSurvey';
import InventoryItemClass from './Models/InventoryItem';
import SessionClass from './Models/Session';
import UserClass from './Models/User';

// Set up connection information
export const sequelize = new Sequelize('lujs', null, null, {
  dialect: config.get('database.type'),
  storage: config.get('database.connection'),
  logging: false
});

// Test connection
sequelize.authenticate().then(function (err) {
  if (err) throw new Error('Unable to connect to the database:' + err);
  console.log('Connected to the LUJS database');
});

export const Ban = BanClass(sequelize);
export const Character = CharacterClass(sequelize);
export const HardwareSurvey = HardwareSurveyClass(sequelize);
export const InventoryItem = InventoryItemClass(sequelize);
export const Session = SessionClass(sequelize);
export const User = UserClass(sequelize);

// relationships
Character.hasMany(InventoryItem, {
  as: 'Items',
  foreignKey: 'character_id',
  sourceKey: 'id'
});
