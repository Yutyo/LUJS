const Sequelize = require('sequelize');
const Log = require('../../Log');

const HardwareSurvey = sequelize.define('hardware_survey', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    process_information: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    graphics_information: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    number_of_processors: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    processor_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    processor_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

HardwareSurvey.sync({force: rebuildDB}).then(() => {
});

module.exports = HardwareSurvey;