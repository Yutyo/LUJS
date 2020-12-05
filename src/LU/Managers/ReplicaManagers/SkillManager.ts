import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';
import { SerializationType } from '../../Replica/SerializationType';
import GameObject from '../../Replica/Object';

export default class SkillManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object: GameObject) => {
      if (object.components.hasComponent(Components.SKILL_COMPONENT)) {
        this.#data[Number(object.ID)] = {};

        object.addSerializer(
          SerializationOrder.indexOf(Components.SKILL_COMPONENT),
          (type, stream) => {
            // const data = manager._data[object.ID.low];
            if (type === SerializationType.CREATION) {
              stream.writeBit(false);
            }
          }
        );
      }
    });
  }
}
