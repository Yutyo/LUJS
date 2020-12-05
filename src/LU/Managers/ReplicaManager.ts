import GenericManager from './GenericManager';
import GameObject from '../Replica/Object';
import { Server } from '../../server/Server';
import Vector3f from '../../geometry/Vector3f';
import Vector4f from '../../geometry/Vector4f';

/**
 * A manager for objects in game
 */
export default class ReplicaManager extends GenericManager {
  #objects: { [index: number]: GameObject };
  #callbacks: { [index: number]: (value?) => void };
  #count: number;

  constructor(server: Server) {
    super(server);
    /**
     *
     * @type {{Object}}
     * @private
     */
    this.#objects = {};

    /**
     *
     * @type {{Function}}
     * @private
     */
    this.#callbacks = {};

    this.#count = 0;

    // now time to wait for objects to load...
    this.eventBus.on('new-object-loaded', (object) => {
      /* let stream = new BitStream();
            stream.writeByte(RakMessages.ID_REPLICA_MANAGER_CONSTRUCTION);
            stream.writeBit(true);
            stream.writeShort(this._count);
            object.serialize(SerializationType.CREATION, stream); */
      // we need to broadcast this creation to all users...

      // server.broadcast(stream, Reliability.RELIABLE);
      this.#callbacks[object.ID.low](object);
      // stream.toFile((Date.now() / 1000 | 0) + "_[24]_[01-00]_(1).bin");
    });
  }

  /**
   *
   * @param objectTemplate
   * @param pos
   * @param rot
   * @param scale
   * @param owner
   * @param data
   * @param {bigint} [lwoobjid]
   */
  loadObject(
    objectTemplate: number,
    pos: Vector3f,
    rot: Vector4f,
    scale: number,
    owner: bigint,
    data,
    lwoobjid: bigint
  ) {
    this.#count++;
    if (lwoobjid === undefined) {
      // TODO: Need to set up the LWOOBJID Manager to increment object ID's '.nextID()'?
      console.log('Needs LWOOBJID');
    }

    const replicaManagerCount = this.#count;

    const obj = new GameObject(
      this,
      replicaManagerCount,
      lwoobjid,
      objectTemplate,
      pos,
      rot,
      scale,
      owner,
      data
    );

    const promise = new Promise((resolve, reject) => {
      this.#callbacks[Number(obj.ID)] = resolve;
    });
    this.#objects[Number(obj.ID)] = obj;

    return promise;
  }

  constructObject(id: bigint) {
    //TODO
  }

  constructAllObjects(user: bigint) {
    //TODO
  }

  /**
   *
   * @param {bigint} id
   * @returns {GameObject}
   */
  getObject(id: bigint) {
    return this.#objects[Number(id)];
  }
}
