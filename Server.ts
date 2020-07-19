

const fs = require('fs');
const util = require('util');
const config = require('config');

const readFile = util.promisify(fs.readFile);

const LUZ = require('./LU/Level/luz').default;
const BitStream = require('node-raknet/structures/BitStream').default;
const ReplicaManager = require('./LU/Managers/ReplicaManager');
const LWOOBJIDManager = require('./LU/Managers/LWOOBJIDManager');
const ChatManager = require('./LU/Managers/ChatManager');

// Replica component managers
const CharacterManager = require('./LU/Managers/ReplicaManagers/CharacterManager');
const ControllablePhysicsManager = require('./LU/Managers/ReplicaManagers/ControllablePhysicsManager');
const DestructibleManager = require('./LU/Managers/ReplicaManagers/DestructibleManager');
const InventoryManager = require('./LU/Managers/ReplicaManagers/InventoryManager');
const RenderManager = require('./LU/Managers/ReplicaManagers/RenderManager');
const RocketLandingManager = require('./LU/Managers/ReplicaManagers/RocketLandingManager');
const SkillManager = require('./LU/Managers/ReplicaManagers/SkillManager');
const SoundAmbient2DManager = require('./LU/Managers/ReplicaManagers/SoundAmbient2DManager');
const Unknown107Manager = require('./LU/Managers/ReplicaManagers/Unknown107Manager');

const { ZoneTable } = require('./DB/CDClient');

import RakServer from 'node-raknet/RakServer';
import * as events from 'events';
import Manager from "./LU/Managers/Manager";

export class RakServerExtended extends RakServer {
  userMessageHandler: events.EventEmitter;
  parent: Server;

  constructor(ip : string, port : number, password : string) {
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
  constructor (rakserver : RakServerExtended, ip : string, port : number, zoneID : number) {
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
  close () {
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
  get rakServer () : RakServerExtended{
    return this.#rakserver;
  }

  /**
   * Returns the IP of this server to redirect to
   * @returns {string}
   */
  get ip () : string {
    return this.#ip;
  }

  /**
   * Returns this port of this server to redirect to
   * @returns {number}
   */
  get port () : number {
    return this.#port;
  }

  /**
   * Returns the event bus for this server
   * @return {events.EventEmitter}
   */
  get eventBus () : events.EventEmitter {
    return this.#rakserver.userMessageHandler;
  }

  /**
   * Returns the zone ID associated with this server
   * @return {number}
   */
  get zoneID () {
    return this.#zoneID;
  }

  /**
   * Returns the root Manager of this server
   * @return {Manager}
   */
  get manager () {
    return this.#manager;
  }

  /**
   * Returns the LUZ of this server
   * @return {LUZ}
   */
  get luz () {
    return this.#luz;
  }

  /**
   * Loads an LUZ file given a zone ID
   * @param {Number} zoneID
   * @return {Promise<>}
   */
  loadLUZ (zoneID) {
    const server = this;
    return ZoneTable.findByPk(zoneID)
      .then(zone => {
        return readFile(config.get('mapsFolder') + zone.zoneName);
      })
      .then(file => {
        //server.#luz = new LUZ(new BitStream(file));
      });
  }

  /**
   * Broadcasts message to all clients connected
   * @param {BitStream} stream
   * @param {Number} reliability
   */
  broadcast (stream, reliability) {
    this.#rakserver.connections.forEach(client => {
      client.send(stream, reliability);
    });
  }
}
