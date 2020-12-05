import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';
import GameObject from '../../Replica/Object';

export default class InventoryManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    /**
     * @param {Object} object
     */
    server.eventBus.on('new-object-created', (object: GameObject) => {
      if (object.components.hasComponent(Components.INVENTORY_COMPONENT)) {
        this.#data[Number(object.ID)] = {
          inventory: undefined
        };

        object.addSerializer(
          SerializationOrder.indexOf(Components.INVENTORY_COMPONENT),
          (type, stream) => {
            const data = this.#data[Number(object.ID)];
            stream.writeBit(data.inventory !== undefined);
            if (data.inventory !== undefined) {
              stream.writeLong(data.inventory.length);
              for (let i = 0; i < data.inventory.length; i++) {
                data.inventory[i].id.serialize(stream);
                stream.writeLong(data.inventory[i].lot);
                stream.writeBit(false);
                stream.writeBit(data.inventory[i].count > 1);
                if (data.inventory[i].count > 1) {
                  stream.writeLong(data.inventory[i].count);
                }
                stream.writeBit(data.inventory[i].slot !== -1);
                if (data.inventory[i].slot !== -1) {
                  stream.writeShort(data.inventory[i].slot);
                }
                stream.writeBit(false);
                stream.writeBit(false);
                stream.writeBit(true);
              }
            }
            stream.writeBit(false);
          }
        );
      }
    });
  }

  /**
   *
   * @param {bigint} objectID
   * @returns {Object}
   */
  getObjectData(objectID: bigint) {
    return this.#data[Number(objectID)];
  }

  /**
   *
   * @param {bigint} objectID
   * @param {Object} data
   */
  setObjectData(objectID: bigint, data) {
    this.#data[Number(objectID)] = data;
  }
}
