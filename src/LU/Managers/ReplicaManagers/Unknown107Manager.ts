import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';
import GameObject from '../../Replica/Object';

export default class Unknown107Manager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object: GameObject) => {
      if (object.components.hasComponent(Components.UNKNOWN_107_COMPONENT)) {
        this.#data[Number(object.ID)] = {};

        object.addSerializer(
          SerializationOrder.indexOf(Components.UNKNOWN_107_COMPONENT),
          (type, stream) => {
            // const data = manager._data[object.ID.low];
            stream.writeBit(false);
          }
        );
      }
    });
  }
}
