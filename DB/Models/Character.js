const Sequelize = require('sequelize');
const Log = require('../../Log');

const Character = sequelize.define('character', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    unapproved_name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    shirt_color: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    shirt_style: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    pants_color: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    hair_style: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    hair_color: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    lh: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    rh: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    eyebrows: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    eyes: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    mouth: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    zone: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    instance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    clone: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    last_log: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: 0,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    x: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: -626.5847
    },
    y: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 613.3515
    },
    z: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: -28.6374
    },
    rotation_x: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.7015
    },
    rotation_y: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    },
    rotation_z: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.7126
    },
    rotation_w: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    }
});

Character.sync({force: rebuildDB}).then(() => {
});


module.exports = Character;