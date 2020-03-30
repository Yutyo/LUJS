const Sequelize = require('sequelize');

module.exports = sequelize => {
  return sequelize.define(
    'ComponentsRegistry',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      component_type: {
        type: Sequelize.INTEGER
      },
      component_id: {
        type: Sequelize.INTEGER
      }
    },
    {
      timestamps: false,
      tableName: 'ComponentsRegistry'
    }
  );
};
