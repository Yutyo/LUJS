import { Sequelize, INTEGER, Model } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'ComponentsRegistry',
    {
      id: {
        type: INTEGER,
        primaryKey: true
      },
      component_type: {
        type: INTEGER
      },
      component_id: {
        type: INTEGER
      }
    },
    {
      timestamps: false,
      tableName: 'ComponentsRegistry'
    }
  );
};
