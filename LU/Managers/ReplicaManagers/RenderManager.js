const GenericManager = require('../GenericManager').default;
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
const SerializationType = require('../../Replica/SerializationType');
class RenderManager extends GenericManager {
  constructor (server) {
    super(server);

    this._data = {};

    // To fix scoping issues inside of callbacks
    const manager = this;

    /**
     * @param {Object} object
     */
    server.eventBus.on('new-object-created', object => {
      if (object.components.hasComponent(Components.RENDER_COMPONENT)) {
        manager._data[object.ID.low] = {
          effects: []
        };

        object.addSerializer(
          SerializationOrder.indexOf(Components.RENDER_COMPONENT),
          (type, stream) => {
            const data = manager._data[object.ID.low];

            if (type === SerializationType.CREATION) {
              stream.writeLong(data.effects.length);
              for (let i = 0; i < data.effects.length; i++) {
                stream.writeByte(data.effects[i].name.length);
                for (let j = 0; j < data.effects[i].name.length; j++) {
                  stream.writeChar(data.effects[i].name.charCodeAt(j));
                }
                stream.writeLong(data.effects[i].effectID);
                stream.writeByte(data.effects[i].type.length);
                for (let j = 0; j < data.effects[i].type.length; j++) {
                  stream.writeShort(data.effects[i].type.charCodeAt(j));
                }
                stream.writeFloat(data.effects[i].scale);
                stream.writeLongLong(data.effects[i].secondary);
              }
            }
          }
        );
      }
    });
  }
}

module.exports = RenderManager;
