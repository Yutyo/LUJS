const fs = require('fs');
const LUZ = require('./LU/Level/luz');
const BitStream = require('node-raknet/BitStream');
const Manager = require('./LU/Managers/Manager');
const ReplicaManager = require('./LU/Managers/ReplicaManager');
const LWOOBJIDManager = require('./LU/Managers/LWOOBJIDManager');

const ControllablePhysicsManager = require('./LU/Managers/ControllablePhysicsManager');

class Server {
    /**
     *
     * @param {RakServer} rakserver
     * @param {Number} zoneID
     */
    constructor(rakserver, zoneID) {
        this._rakserver = rakserver;
        this._zoneID = zoneID;
        let server = this;
        this._rakserver.getServer = function() {
            return server;
        };

        if(this.zoneID > 0) {
            this.loadLUZ(this.zoneID);
        }

        // Attach managers
        this._manager = new Manager();
        this._manager.attachManager('replica', new ReplicaManager(this));
        this._manager.attachManager('lwoobjid', new LWOOBJIDManager(this));
        this._manager.attachManager('controllable-physics', new ControllablePhysicsManager(this));
    }

    get rakServer() {
        return this._rakserver;
    }

    get eventBus() {
        return this._rakserver.userMessageHandler;
    }

    get zoneID() {
        return this._zoneID;
    }

    get manager() {
        return this._manager;
    }

    get luz() {
        return this._luz;
    }

    loadLUZ(zoneID) {
        ZoneTable.findById(zoneID).then(zone => {
            this._luz = new LUZ(new BitStream(fs.readFileSync(maps + zone.zoneName)));
        });
    }
}

module.exports = Server;