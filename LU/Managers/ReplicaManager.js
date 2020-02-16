const GenericManager = require('./GenericManager');
const Object = require('../Replica/Object');
const BitStream = require('node-raknet/BitStream');
const SerializationType = require('../Replica/SerializationType');
const Reliability = require('node-raknet/ReliabilityLayer').Reliability;
const RakMessages = require('node-raknet/RakMessages.js');

/**
 * A manager for objects in game
 */
class ReplicaManager extends GenericManager {
    constructor(server) {
        super(server);
        /**
         *
         * @type {{Object}}
         * @private
         */
        this._objects = {};

        /**
         *
         * @type {{Function}}
         * @private
         */
        this._callbacks = {};

        this._count = 0;

        // now time to wait for objects to load...
        this.eventBus.on('new-object-loaded', (object) => {
            /*let stream = new BitStream();
            stream.writeByte(RakMessages.ID_REPLICA_MANAGER_CONSTRUCTION);
            stream.writeBit(true);
            stream.writeShort(this._count);
            object.serialize(SerializationType.CREATION, stream);*/
            // we need to broadcast this creation to all users...

            //server.broadcast(stream, Reliability.RELIABLE);
            this._callbacks[object.ID.low](object);
            //stream.toFile((Date.now() / 1000 | 0) + "_[24]_[01-00]_(1).bin");
        });
    }

    /**
     *
     * @param objectTemplate
     * @param pos
     * @param rot
     * @param scale
     * @param owner
     * @param data
     * @param {LWOOBJID} [lwoobjid]
     */
    loadObject(objectTemplate, pos, rot, scale, owner, data, lwoobjid) {
        this._count ++;
        if(lwoobjid === undefined) {
            // TODO: Need to set up the LWOOBJID Manager to increment object ID's '.nextID()'?
        } else {

        }

        let obj = new Object(this, this._count, lwoobjid, objectTemplate, pos, rot, scale, owner, data);

        let manager = this;

        let promise = new Promise((resolve, reject) => {
            manager._callbacks[obj.ID.low] = resolve;
        });
        this._objects[obj.ID.low] = obj;

        return promise;
    }

    constructObject(id) {

    }

    constructAllObjects(user) {

    }

    /**
     *
     * @param {LWOOBJID} id
     * @returns {GameObject}
     */
    getObject(id) {
        return this._objects[id.low];
    }
}

module.exports = ReplicaManager;