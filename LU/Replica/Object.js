const ComponentMask = require('./ComponentMask');
const Components = require('./Components');
const SerializationType = require('./SerializationType');

class Object {
    constructor(replicaManager, id, objectTemplate, pos, rot, scale, owner, data) {

        this._rm = replicaManager;

        // For use of keeping track of the object
        this._id = id;

        // Set the component mask up
        this.components = new ComponentMask();
        ComponentsRegistry.findAll({
            where: {
                id: objectTemplate,
            }
        }).then(components => {
            components.forEach(component => {
                this.components.addComponent(component.component_type); // Add components to mask
            });
        }).then(() => {
            this._rm.eventBus.emit('new-object-created', this);
        });

        this._template = objectTemplate;
        this._pos = pos;
        this._rot = rot;
        this._scale = scale;
        this._owner = owner;
        this._data = data;

        this._serializers = {};
    }

    /**
     * Serializes this object to a stream
     * @param {SerializationType} type
     * @param {BitStream} stream
     */
    serialize(type, stream) {
        if(type === SerializationType.CREATION) {
            stream.writeLong(this.ID.low);
            stream.writeLong(this.ID.high);

            stream.writeLong(this.LOT);

            stream.writeByte(0); // TODO: add a name field and serialize it here

            stream.writeLong(0); // TODO: Keep track of how long this object has been created on server
            stream.writeBit(false); // TODO: Add support for this structure
            stream.writeBit(false); // TODO: Add support for Trigger ID
            stream.writeBit(false); // TODO: Add support for Spawner ID, set here as a s64
            stream.writeBit(false); // TODO: Add support for Spawner Node ID, set here as a u32
            stream.writeBit(this.scale !== 1);
            if(this.scale !== 1) {
                stream.writeFloat(this.scale);
            }
            stream.writeBit(false); // TODO: Add support for Object World State
            stream.writeBit(false); // TODO: Add support for GM Level
        }
        stream.writeBit(false); // TODO: add support for child/parent objects
    }

    addSerializer(id, method) {
        this._serializers[id] = method;
        if(Object.keys(this._serializers).length === this.components.getComponentsList().length) {
            // this means that we have a serializer for every component that the object has and we are loaded
            this._rm.eventBus.emit('new-object-loaded', this);
        }
    }

    removeSerializer(id) {
        delete this._serializers[id];
    }

    /**
     *
     * @return {LWOOBJID}
     * @constructor
     */
    get ID() {
        return this._id;
    }

    /**
     *
     * @return {Number}
     * @constructor
     */
    get LOT() {
        return this._template;
    }

    get position() {
        return this._pos;
    }

    get rotation() {
        return this._rot;
    }

    get scale() {
        return this._scale;
    }

    get owner() {
        return this._owner;
    }

    get data() {
        return this._data;
    }
}

module.exports = Object;