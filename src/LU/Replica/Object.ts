import ReplicaManager from '../Managers/ReplicaManager';
import Vector3f from '../../geometry/Vector3f';
import Vector4f from '../../geometry/Vector4f';
import * as events from 'events';
import BitStream from 'node-raknet/structures/BitStream';
import ComponentMask from './ComponentMask';
import { SerializationType } from './SerializationType';

import { ComponentsRegistry } from '../../DB/CDClient';

export default class GameObject {
  #rm: ReplicaManager;
  #netId: number;
  #id: bigint;
  #template: number;
  #pos: Vector3f;
  #rot: Vector4f;
  #scale: number;
  #owner: bigint;
  #data: any;
  #serializers: Array<any>;
  #bus: events.EventEmitter;
  components: ComponentMask;

  /**
   *
   * @param {ReplicaManager} replicaManager
   * @param {number} networkId
   * @param {bigint} id
   * @param {number} objectTemplate
   * @param {Vector3f} pos
   * @param {Vector4f} rot
   * @param {number} scale
   * @param {bigint} owner
   * @param data
   */
  constructor(
    replicaManager: ReplicaManager,
    networkId: number,
    id: bigint,
    objectTemplate: number,
    pos: Vector3f,
    rot: Vector4f,
    scale: number,
    owner: bigint,
    data
  ) {
    this.#rm = replicaManager;

    this.#netId = networkId;

    // For use of keeping track of the object
    this.#id = id;

    // Set the component mask up
    this.components = new ComponentMask();
    ComponentsRegistry.findAll({
      where: {
        id: objectTemplate
      }
    })
      .then((components) => {
        components.forEach((component) => {
          this.components.addComponent(component.component_type); // Add components to mask
        });
      })
      .then(() => {
        this.#rm.eventBus.emit('new-object-created', this);
      });

    this.#template = objectTemplate;
    this.#pos = pos;
    this.#rot = rot;
    this.#scale = scale;
    this.#owner = owner;
    this.#data = data;

    this.#serializers = [];

    this.#bus = new events.EventEmitter();
  }

  /**
   * Serializes this object to a stream
   * @param {number} type
   * @param {BitStream} stream
   */
  serialize(type: number, stream: BitStream) {
    if (type === SerializationType.CREATION) {
      stream.writeLongLong(this.ID);

      stream.writeLong(this.LOT);

      stream.writeByte('testing'.length); // TODO: add a name field and serialize it here
      stream.writeWString('testing', 'testing'.length);

      stream.writeLong(0); // TODO: Keep track of how long this object has been created on server
      stream.writeBit(false); // TODO: Add support for this structure
      stream.writeBit(false); // TODO: Add support for Trigger ID
      stream.writeBit(false); // TODO: Add support for Spawner ID, set here as a s64
      stream.writeBit(false); // TODO: Add support for Spawner Node ID, set here as a u32
      stream.writeBit(this.scale !== 1);
      if (this.scale !== 1) {
        stream.writeFloat(this.scale);
      }
      stream.writeBit(false); // TODO: Add support for GameObject World State
      stream.writeBit(false); // TODO: Add support for GM Level
    }
    stream.writeBit(false); // TODO: add support for child/parent objects

    const serializers = this.#serializers;
    serializers.forEach((serializer) => {
      serializer(type, stream);
    });
  }

  addSerializer(id: number, method: any) {
    this.#serializers[id] = method;
    if (
      Object.keys(this.#serializers).length ===
      this.components.getComponentsList().length
    ) {
      // this means that we have a serializer for every component that the object has and we are loaded
      this.#rm.eventBus.emit('new-object-loaded', this);
    }
  }

  removeSerializer(id: number) {
    delete this.#serializers[id];
  }

  /**
   *
   * @return {bigint}
   * @constructor
   */
  get ID(): bigint {
    return this.#id;
  }

  /**
   *
   * @return {Number}
   * @constructor
   */
  get LOT(): number {
    return this.#template;
  }

  get position(): Vector3f {
    return this.#pos;
  }

  get rotation(): Vector4f {
    return this.#rot;
  }

  get scale(): number {
    return this.#scale;
  }

  get owner(): bigint {
    return this.#owner;
  }

  get data(): any {
    return this.#data;
  }

  get netID(): number {
    return this.#netId;
  }

  /**
   *
   * @param {Number} id
   * @param {LUGameMessage} gm
   * @param user
   */
  emitGM(id: number, gm: number, user) {
    this.#bus.emit(id.toString(), gm, user, this);
  }

  /**
   *
   * @param {Number} id
   * @param {Function} callback
   */
  addGMListener(id: number, callback: () => void) {
    this.#bus.on(id.toString(), callback);
  }
}
