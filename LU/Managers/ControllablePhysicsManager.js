const GenericManager = require('./GenericManager');
const Components = require('../Replica/Components');
const SerializationOrder = require('../Replica/SerializationOrder');
const SerializationType = require('../Replica/SerializationType');
class ControllablePhysicsManager extends GenericManager {
    constructor(server) {
        super(server);

        this._data = {};

        // To fix scoping issues inside of callbacks
        let manager = this;

        /**
         * @param {Object} object
         */
        server.eventBus.on('new-object-created', object => {
            if(object.components.hasComponent(Components.CONTROLABLE_PHYSICS_COMPONENT)) {
                // Add data

                manager._data[object.ID] = {
                    unknown1: undefined,
                    unknown2: undefined,
                    unknown3: undefined,
                    unknown4: undefined,
                    unknown5: undefined,
                    positionData: {
                        x: object.position.x,
                        y: object.position.y,
                        z: object.position.z,
                        rx: object.rotation.x,
                        ry: object.rotation.y,
                        rz: object.rotation.z,
                        rw: object.rotation.w,
                        isPlayerOnGround: true,
                        unknown1: false,
                        velocity: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        angularVelocity: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                    },
                    data: false
                };

                object.addSerializer(SerializationOrder.indexOf(Components.CONTROLABLE_PHYSICS_COMPONENT), (type, stream) => {
                    let data = manager._data[object.ID];
                    if(type === SerializationType.CREATION) {
                        stream.writeBit(data.unknown1 !== undefined);
                        stream.writeBit(data.unknown2 !== undefined);
                    }
                    stream.writeBit(data.unknown3 !== undefined);
                    stream.writeBit(data.unknown4 !== undefined);
                    stream.writeBit(data.unknown5 !== undefined);
                    stream.writeBit(data.positionData !== undefined);
                    if(data.positionData !== undefined) {

                    }
                });
            }
        });
    }
}

module.exports = ControllablePhysicsManager;