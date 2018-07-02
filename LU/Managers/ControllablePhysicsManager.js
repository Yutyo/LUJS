const GenericManager = require('./GenericManager');
const Components = require('../Replica/Components');
const SerializationOrder = require('../Replica/SerializationOrder');

class ControllablePhysicsManager extends GenericManager {
    constructor(server) {
        super(server);

        this._data = {};

        server.eventBus.on('new-object-created', object => {
            if(object.components.hasComponent(Components.CONTROLABLE_PHYSICS_COMPONENT)) {
                object.addSerializer(SerializationOrder.indexOf(Components.CONTROLABLE_PHYSICS_COMPONENT), (type, stream) => {
                    // TODO: Add code
                });
            }
        });
    }
}

module.exports = ControllablePhysicsManager;