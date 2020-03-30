const Sequelize = require('sequelize');

module.exports = sequelize => {
  return sequelize.define('session', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false
    },
    ip: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    character_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });
};
