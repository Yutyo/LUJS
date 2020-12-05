import { Sequelize, Model, INTEGER, TEXT, DATE, NOW } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: TEXT,
      allowNull: false
    },
    password: {
      type: TEXT,
      allowNull: false
    },
    email: {
      type: TEXT,
      allowNull: false
    },
    first_name: {
      type: TEXT,
      allowNull: false
    },
    last_name: {
      type: TEXT,
      allowNull: false
    },
    birthdate: {
      type: TEXT,
      allowNull: false
    },
    createdAt: {
      type: DATE,
      defaultValue: NOW
    },
    updatedAt: {
      type: DATE,
      defaultValue: NOW
    }
  });
};
