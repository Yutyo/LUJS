const GenericManager = require('../GenericManager');
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
const SerializationType = require('../../Replica/SerializationType');
class RenderManager extends GenericManager {
    constructor(server) {
        super(server);

        this._data = {};

        // To fix scoping issues inside of callbacks
        let manager = this;

        /**
         * @param {Object} object
         */
        server.eventBus.on('new-object-created', object => {
            if(object.components.hasComponent(Components.RENDER_COMPONENT)) {
                manager._data[object.ID.low] = {
                    effects: [],
                };

                object.addSerializer(SerializationOrder.indexOf(Components.RENDER_COMPONENT), (type, stream) => {
                    let data = manager._data[object.ID.low];

                    if(type === SerializationType.CREATION) {
                        stream.writeLong(data.length);
                    }
                });
            }
        });
    }
}

module.exports = RenderManager;