const GenericManager = require('./GenericManager');
const Object = require('../Replica/Object');
const BitStream = require('node-raknet/BitStream');
const SerializationType = require('../Replica/SerializationType');

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

        // now time to wait for objects to load...
        this.eventBus.on('new-object-loaded', (object) => {
            let stream = new BitStream();
            stream.writeBit(false); // TODO: wtf is the network id thing?
            object.serialize(SerializationType.CREATION, stream);
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
        if(lwoobjid === undefined) {
            // TODO: Need to set up the LWOOBJID Manager to increment object ID's '.nextID()'?
        }
        let obj = new Object(this, lwoobjid, objectTemplate, pos, rot, scale, owner, data);

        this._objects[obj.ID.low] = obj;
    }

    constructObject(id) {

    }

    constructAllObjects(user) {

    }
}

module.exports = ReplicaManager;