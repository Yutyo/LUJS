const Sequelize = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('inventory_item', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    character_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    lot: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    slot: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    count: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_equipped: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_linked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });
};
