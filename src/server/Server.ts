import * as fs from 'fs';
import * as util from 'util';
import * as config from 'config';

const readFile = util.promisify(fs.readFile);

import LUZ from '../LU/Level/luz';
import BitStream from 'node-raknet/structures/BitStream';
import ReplicaManager from '../LU/Managers/ReplicaManager';
import LWOOBJIDManager from '../LU/Managers/LWOOBJIDManager';
import ChatManager from '../LU/Managers/ChatManager';

// Replica component managers
import CharacterManager from '../LU/Managers/ReplicaManagers/CharacterManager';
import ControllablePhysicsManager from '../LU/Managers/ReplicaManagers/ControllablePhysicsManager';
import DestructibleManager from '../LU/Managers/ReplicaManagers/DestructibleManager';
import InventoryManager from '../LU/Managers/ReplicaManagers/InventoryManager';
import RenderManager from '../LU/Managers/ReplicaManagers/RenderManager';
import RocketLandingManager from '../LU/Managers/ReplicaManagers/RocketLandingManager';
import SkillManager from '../LU/Managers/ReplicaManagers/SkillManager';
import SoundAmbient2DManager from '../LU/Managers/ReplicaManagers/SoundAmbient2DManager';
import Unknown107Manager from '../LU/Managers/ReplicaManagers/Unknown107Manager';

import { ZoneTable } from '../DB/CDClient';

import RakServer from 'node-raknet/RakServer';
import * as events from 'events';
import Manager from '../LU/Managers/Manager';

export class RakServerExtended extends RakServer {
  userMessageHandler: events.EventEmitter;
  parent: Server;
  timeout;

  constructor(ip: string, port: number, password: string) {
    super(ip, port, password);

    this.userMessageHandler = new events.EventEmitter();
  }
}

/**
 * A server instance
 */
export class Server {
  #rakserver: RakServerExtended;
  #ip: string;
  #port: number;
  #zoneID: number;
  #manager: Manager;
  #luz;

  /**
   *
   * @param {RakServerExtended} rakserver The rakserver instance to attach to this server
   * @param {String} ip
   * @param {Number} port
   * @param {Number} zoneID the zone ID of the zone you want to load
   */
  constructor(
    rakserver: RakServerExtended,
    ip: string,
    port: number,
    zoneID: number
  ) {
    this.#rakserver = rakserver;
    this.#ip = ip;
    this.#port = port;
    this.#zoneID = zoneID;

    this.#rakserver.parent = this;

    // if(this.zoneID > 0) {
    //    this.loadLUZ(this.zoneID);
    // }

    // Attach managers
    this.#manager = new Manager();
    this.#manager.attachManager('replica', new ReplicaManager(this));
    this.#manager.attachManager('lwoobjid', new LWOOBJIDManager(this));
    this.#manager.attachManager('chat', new ChatManager(this));

    // Replica Components
    this.#manager.attachManager('character', new CharacterManager(this));
    this.#manager.attachManager(
      'controllable-physics',
      new ControllablePhysicsManager(this)
    );
    this.#manager.attachManager('destructible', new DestructibleManager(this));
    this.#manager.attachManager('inventory', new InventoryManager(this));
    this.#manager.attachManager('render', new RenderManager(this));
    this.#manager.attachManager(
      'rocket-landing',
      new RocketLandingManager(this)
    );
    this.#manager.attachManager('skill', new SkillManager(this));
    this.#manager.attachManager(
      'sound-ambient-2d',
      new SoundAmbient2DManager(this)
    );
    this.#manager.attachManager('unknown-127', new Unknown107Manager(this));
  }

  /**
   * Closes this server
   * @returns {Promise<>}
   */
  close() {
    return new Promise((resolve, reject) => {
      this.rakServer.server.close(() => {
        resolve();
      });
    });
  }

  /**
   * Returns the rakserver instance associated to this server
   * @return {RakServerExtended}
   */
  get rakServer(): RakServerExtended {
    return this.#rakserver;
  }

  /**
   * Returns the IP of this server to redirect to
   * @returns {string}
   */
  get ip(): string {
    return this.#ip;
  }

  /**
   * Returns this port of this server to redirect to
   * @returns {number}
   */
  get port(): number {
    return this.#port;
  }

  /**
   * Returns the event bus for this server
   * @return {events.EventEmitter}
   */
  get eventBus(): events.EventEmitter {
    return this.#rakserver.userMessageHandler;
  }

  /**
   * Returns the zone ID associated with this server
   * @return {number}
   */
  get zoneID() {
    return this.#zoneID;
  }

  /**
   * Returns the root Manager of this server
   * @return {Manager}
   */
  get manager() {
    return this.#manager;
  }

  /**
   * Returns the LUZ of this server
   * @return {LUZ}
   */
  get luz() {
    return this.#luz;
  }

  /**
   * Loads an LUZ file given a zone ID
   * @param {Number} zoneID
   * @return {Promise<>}
   */
  loadLUZ(zoneID) {
    return ZoneTable.findByPk(zoneID)
      .then((zone) => {
        return readFile(config.get('mapsFolder') + zone.zoneName);
      })
      .then((file) => {
        //server.#luz = new LUZ(new BitStream(file));
      });
  }

  /**
   * Broadcasts message to all clients connected
   * @param {BitStream} stream
   * @param {Number} reliability
   */
  broadcast(stream, reliability) {
    this.#rakserver.connections.forEach((client) => {
      client.send(stream, reliability);
    });
  }
}
