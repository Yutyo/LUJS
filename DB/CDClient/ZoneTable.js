const Sequelize = require('sequelize');

const ZoneTable = CDClient.define('ZoneTable', {
    zoneID: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    locStatus: {
        type: Sequelize.INTEGER,
    },
    zoneName: {
        type: Sequelize.TEXT,
    },
    scriptID: {
        type: Sequelize.INTEGER,
    },
    ghostdistance_min: {
        type: Sequelize.FLOAT,
    },
    ghostdistance: {
        type: Sequelize.FLOAT,
    },
    population_soft_cap: {
        type: Sequelize.INTEGER,
    },
    population_hard_cap: {
        type: Sequelize.INTEGER,
    },
    DisplayDescription: {
        type: Sequelize.TEXT,
    },
    mapFolder: {
        type: Sequelize.TEXT,
    },
    smashableMinDistance: {
        type: Sequelize.FLOAT,
    },
    smashableMaxDistance: {
        type: Sequelize.FLOAT,
    },
    mixerProgram: {
        type: Sequelize.TEXT,
    },
    clientPhysicsFramerate: {
        type: Sequelize.TEXT,
    },
    serverPhysicsFramerate: {
        type: Sequelize.TEXT,
    },
    zoneControlTemplate: {
        type: Sequelize.INTEGER,
    },
    widthInChunks: {
        type: Sequelize.INTEGER,
    },
    heightInChunks: {
        type: Sequelize.INTEGER,
    },
    petsAllowed: {
        type: Sequelize.BOOLEAN,
    },
    localize: {
        type: Sequelize.BOOLEAN,
    },
    fZoneWeight: {
        type: Sequelize.FLOAT,
    },
    thumbnail: {
        type: Sequelize.TEXT,
    },
    PlayerLoseCoinsOnDeath: {
        type: Sequelize.BOOLEAN,
    },
    disableSaveLoc: {
        type: Sequelize.BOOLEAN,
    },
    teamRadius: {
        type: Sequelize.FLOAT,
    },
    gate_version: {
        type: Sequelize.TEXT,
    },
    mountsAllowed: {
        type: Sequelize.BOOLEAN,
    },
}, {
    timestamps: false,
    tableName: 'ZoneTable',
});

module.exports = ZoneTable;