import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';

export default class RocketLandingManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object) => {
      if (object.components.hasComponent(Components.ROCKET_LANDING_COMPONENT)) {
        object.addSerializer(
          SerializationOrder.indexOf(Components.ROCKET_LANDING_COMPONENT),
          (type, stream) => {
            // No serialization for this object, but add a empty one
          }
        );
      }
    });
  }
}
