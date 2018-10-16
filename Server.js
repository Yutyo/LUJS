const fs = require('fs');
const EventEmitter = require('events');

const LUZ = require('./LU/Level/luz');
const BitStream = require('node-raknet/BitStream');
const Manager = require('./LU/Managers/Manager');
const ReplicaManager = require('./LU/Managers/ReplicaManager');
const LWOOBJIDManager = require('./LU/Managers/LWOOBJIDManager');

//Replica component managers
const CharacterManager = require('./LU/Managers/ReplicaManagers/CharacterManager');
const ControllablePhysicsManager = require('./LU/Managers/ReplicaManagers/ControllablePhysicsManager');
const DestructibleManager = require('./LU/Managers/ReplicaManagers/DestructibleManager');
const InventoryManager = require('./LU/Managers/ReplicaManagers/InventoryManager');
const RenderManager = require('./LU/Managers/ReplicaManagers/RenderManager');
const RocketLandingManager = require('./LU/Managers/ReplicaManagers/RocketLandingManager');
const SkillManager = require('./LU/Managers/ReplicaManagers/SkillManager');
const SoundAmbient2DManager = require('./LU/Managers/ReplicaManagers/SoundAmbient2DManager');
const Unknown107Manager = require('./LU/Managers/ReplicaManagers/Unknown107Manager');

class Server {
    /**
     *
     * @param {RakServer} rakserver
     * @param {Number} zoneID
     */
    constructor(rakserver, zoneID) {
        this._rakserver = rakserver;
        this._rakserver.userMessageHandler = new EventEmitter();
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

        // Replica Components
        this._manager.attachManager('character', new CharacterManager(this));
        this._manager.attachManager('controllable-physics', new ControllablePhysicsManager(this));
        this._manager.attachManager('destructible', new DestructibleManager(this));
        this._manager.attachManager('inventory', new InventoryManager(this));
        this._manager.attachManager('render', new RenderManager(this));
        this._manager.attachManager('rocket-landing', new RocketLandingManager(this));
        this._manager.attachManager('skill', new SkillManager(this));
        this._manager.attachManager('sound-ambient-2d', new SoundAmbient2DManager(this));
        this._manager.attachManager('unknown-127', new Unknown107Manager(this));
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