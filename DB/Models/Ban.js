const Sequelize = require('sequelize');
const Log = require('../../Log');

const Ban = sequelize.define('ban', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reason: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    start_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    end_time: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

Ban.sync({force: rebuildDB}).then(() => {
});


module.exports = Ban;
