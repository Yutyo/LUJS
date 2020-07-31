import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';
import { SerializationType } from '../../Replica/SerializationType';
import GameObject from '../../Replica/Object';

export default class RenderManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object: GameObject) => {
      if (object.components.hasComponent(Components.RENDER_COMPONENT)) {
        this.#data[Number(object.ID)] = {
          effects: []
        };

        object.addSerializer(
          SerializationOrder.indexOf(Components.RENDER_COMPONENT),
          (type, stream) => {
            const data = this.#data[Number(object.ID)];

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
