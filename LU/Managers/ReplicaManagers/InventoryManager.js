const GenericManager = require('../GenericManager').default;
const Components = require('../../Replica/Components');
const SerializationOrder = require('../../Replica/SerializationOrder');
class InventoryManager extends GenericManager {
  constructor (server) {
    super(server);

    this._data = {};

    // To fix scoping issues inside of callbacks
    const manager = this;

    /**
     * @param {Object} object
     */
    server.eventBus.on('new-object-created', object => {
      if (object.components.hasComponent(Components.INVENTORY_COMPONENT)) {
        manager._data[object.ID.low] = {
          inventory: undefined
        };

        object.addSerializer(
          SerializationOrder.indexOf(Components.INVENTORY_COMPONENT),
          (type, stream) => {
            const data = manager._data[object.ID.low];
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
   * @param {LWOOBJID} objectID
   * @returns {Object}
   */
  getObjectData (objectID) {
    return this._data[objectID.low];
  }

  /**
   *
   * @param {LWOOBJID} objectID
   * @param {Object} data
   */
  setObjectData (objectID, data) {
    this._data[objectID.low] = data;
  }
}

module.exports = InventoryManager;
