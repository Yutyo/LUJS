import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';
import { SerializationType } from '../../Replica/SerializationType';
import GameObject from '../../Replica/Object';

export default class DestructibleManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object: GameObject) => {
      if (object.components.hasComponent(Components.DESTRUCTABLE_COMPONENT)) {
        this.#data[Number(object.ID)] = {};

        object.addSerializer(
          SerializationOrder.indexOf(Components.DESTRUCTABLE_COMPONENT),
          (type, stream) => {
            // const data = manager._data[object.ID.low];
            if (type === SerializationType.CREATION) {
              stream.writeBit(false);
              stream.writeBit(false);
            }

            // Stats component
            stream.writeBit(false);
            if (type === SerializationType.CREATION) {
              stream.writeBit(false);
            }
            stream.writeBit(false);
          }
        );
      }
    });
  }
}
