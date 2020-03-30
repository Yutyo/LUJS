const GenericManager = require('../GenericManager');
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
class SoundAmbient2DManager extends GenericManager {
  constructor (server) {
    super(server);

    this._data = {};

    // To fix scoping issues inside of callbacks
    // const manager = this;

    /**
     * @param {Object} object
     */
    server.eventBus.on('new-object-created', object => {
      if (
        object.components.hasComponent(Components.SOUND_AMBIENT_2D_COMPONENT)
      ) {
        // This component doesn't have a serialization, so we add a blank one.
        object.addSerializer(
          SerializationOrder.indexOf(Components.SOUND_AMBIENT_2D_COMPONENT),
          (type, stream) => {}
        );
      }
    });
  }
}

module.exports = SoundAmbient2DManager;
