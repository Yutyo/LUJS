const GenericManager = require('../GenericManager');
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
const SerializationType = require('../../Replica/SerializationType');
class InventoryManager extends GenericManager {
    constructor(server) {
        super(server);

        this._data = {};

        // To fix scoping issues inside of callbacks
        let manager = this;

        /**
         * @param {Object} object
         */
        server.eventBus.on('new-object-created', object => {
            if(object.components.hasComponent(Components.INVENTORY_COMPONENT)) {
                manager._data[object.ID.low] = {

                };

                object.addSerializer(SerializationOrder.indexOf(Components.INVENTORY_COMPONENT), (type, stream) => {
                    let data = manager._data[object.ID.low];

                });
            }
        });
    }
}

module.exports = InventoryManager;