import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';

export default class SoundAmbient2DManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object) => {
      if (
        object.components.hasComponent(Components.SOUND_AMBIENT_2D_COMPONENT)
      ) {
        object.addSerializer(
          SerializationOrder.indexOf(Components.SOUND_AMBIENT_2D_COMPONENT),
          (type, stream) => {
            // This component doesn't have a serialization, so we add a blank one.
          }
        );
      }
    });
  }
}
