import GenericManager from '../GenericManager';
import { Components } from '../../Replica/Components';
import { SerializationOrder } from '../../Replica/SerializationOrder';
import { SerializationType } from '../../Replica/SerializationType';
import GameObject from '../../Replica/Object';

export default class ControllablePhysicsManager extends GenericManager {
  #data;

  constructor(server) {
    super(server);

    this.#data = {};

    server.eventBus.on('new-object-created', (object: GameObject) => {
      if (
        object.components.hasComponent(Components.CONTROLABLE_PHYSICS_COMPONENT)
      ) {
        this.#data[Number(object.ID)] = {
          unknown1: undefined,
          unknown2: undefined,
          unknown3: undefined,
          unknown4: undefined,
          unknown5: undefined,
          positionData: {
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
            rx: object.rotation.x,
            ry: object.rotation.y,
            rz: object.rotation.z,
            rw: object.rotation.w,
            isPlayerOnGround: true,
            unknown1: false,
            velocity: {
              x: 0,
              y: 0,
              z: 0
            },
            angularVelocity: {
              x: 0,
              y: 0,
              z: 0
            },
            movingPlatformData: undefined
          },
          moreData: undefined
        };

        object.addSerializer(
          SerializationOrder.indexOf(Components.CONTROLABLE_PHYSICS_COMPONENT),
          (type, stream) => {
            const data = this.#data[Number(object.ID)];
            if (type === SerializationType.CREATION) {
              stream.writeBit(data.unknown1 !== undefined);
              stream.writeBit(data.unknown2 !== undefined);
            }
            stream.writeBit(data.unknown3 !== undefined);
            stream.writeBit(data.unknown4 !== undefined);
            stream.writeBit(data.unknown5 !== undefined);
            stream.writeBit(data.positionData !== undefined);
            if (data.positionData !== undefined) {
              stream.writeFloat(data.positionData.x);
              stream.writeFloat(data.positionData.y);
              stream.writeFloat(data.positionData.z);
              stream.writeFloat(data.positionData.rx);
              stream.writeFloat(data.positionData.ry);
              stream.writeFloat(data.positionData.rz);
              stream.writeFloat(data.positionData.rw);
              stream.writeBit(data.positionData.isPlayerOnGround);
              stream.writeBit(data.positionData.unknown1);
              stream.writeBit(data.positionData.velocity !== undefined);
              if (data.positionData.velocity !== undefined) {
                stream.writeFloat(data.positionData.velocity.x);
                stream.writeFloat(data.positionData.velocity.y);
                stream.writeFloat(data.positionData.velocity.z);
              }
              stream.writeBit(data.positionData.angularVelocity !== undefined);
              if (data.positionData.angularVelocity !== undefined) {
                stream.writeFloat(data.positionData.angularVelocity.x);
                stream.writeFloat(data.positionData.angularVelocity.y);
                stream.writeFloat(data.positionData.angularVelocity.z);
              }
              stream.writeBit(
                data.positionData.movingPlatformData !== undefined
              );
              if (data.positionData.movingPlatformData !== undefined) {
                stream.writeLongLong(
                  data.positionData.movingPlatformData.objectID
                );
                stream.writeFloat(
                  data.positionData.movingPlatformData.unknown1
                );
                stream.writeFloat(
                  data.positionData.movingPlatformData.unknown2
                );
                stream.writeFloat(
                  data.positionData.movingPlatformData.unknown3
                );
                stream.writeBit(
                  data.positionData.movingPlatformData.moreUnknown !== undefined
                );
                if (
                  data.positionData.movingPlatformData.moreUnknown !== undefined
                ) {
                  stream.writeFloat(
                    data.positionData.movingPlatformData.moreUnknown.unknown1
                  );
                  stream.writeFloat(
                    data.positionData.movingPlatformData.moreUnknown.unknown2
                  );
                  stream.writeFloat(
                    data.positionData.movingPlatformData.moreUnknown.unknown3
                  );
                }
              }
            }

            if (type === SerializationType.SERIALIZATION) {
              stream.write(data.moreData !== undefined);
            }
          }
        );
      }
    });
  }
}
