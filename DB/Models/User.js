const Sequelize = require('sequelize');
const Log = require('../../Log');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    first_name: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    last_name: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    birthdate: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
});

User.sync({force: rebuildDB}).then(() => {

});

module.exports = User;