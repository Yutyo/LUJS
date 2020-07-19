const GenericManager = require('../GenericManager').default;
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
class RocketLandingManager extends GenericManager {
  constructor (server) {
    super(server);

    this._data = {};

    // To fix scoping issues inside of callbacks
    // const manager = this;

    /**
     * @param {Object} object
     */
    server.eventBus.on('new-object-created', object => {
      if (object.components.hasComponent(Components.ROCKET_LANDING_COMPONENT)) {
        // No serialization for this object, but add a empty one
        object.addSerializer(
          SerializationOrder.indexOf(Components.ROCKET_LANDING_COMPONENT),
          (type, stream) => {}
        );
      }
    });
  }
}

module.exports = RocketLandingManager;
