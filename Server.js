const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');
const config = require('config');

const readFile = util.promisify(fs.readFile);

const LUZ = require('./LU/Level/luz');
const BitStream = require('node-raknet/BitStream');
const Manager = require('./LU/Managers/Manager');
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

/**
 * A server instance
 */
class Server {
  /**
   *
   * @param {RakServer} rakserver The rakserver instance to attach to this server
   * @param {String} ip
   * @param {Number} port
   * @param {Number} zoneID the zone ID of the zone you want to load
   */
  constructor (rakserver, ip, port, zoneID) {
    this._rakserver = rakserver;

    this._ip = ip;
    this._port = port;

    if (this._rakserver.userMessageHandler === undefined) {
      this._rakserver.userMessageHandler = new EventEmitter();
    }

    this._zoneID = zoneID;
    const server = this;
    this._rakserver.getServer = function () {
      return server;
    };

    // if(this.zoneID > 0) {
    //    this.loadLUZ(this.zoneID);
    // }

    // Attach managers
    this._manager = new Manager();
    this._manager.attachManager('replica', new ReplicaManager(this));
    this._manager.attachManager('lwoobjid', new LWOOBJIDManager(this));
    this._manager.attachManager('chat', new ChatManager(this));

    // Replica Components
    this._manager.attachManager('character', new CharacterManager(this));
    this._manager.attachManager(
      'controllable-physics',
      new ControllablePhysicsManager(this)
    );
    this._manager.attachManager('destructible', new DestructibleManager(this));
    this._manager.attachManager('inventory', new InventoryManager(this));
    this._manager.attachManager('render', new RenderManager(this));
    this._manager.attachManager(
      'rocket-landing',
      new RocketLandingManager(this)
    );
    this._manager.attachManager('skill', new SkillManager(this));
    this._manager.attachManager(
      'sound-ambient-2d',
      new SoundAmbient2DManager(this)
    );
    this._manager.attachManager('unknown-127', new Unknown107Manager(this));
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
   * @return {RakServer}
   */
  get rakServer () {
    return this._rakserver;
  }

  /**
   * Returns the IP of this server to redirect to
   * @returns {String}
   */
  get ip () {
    return this._ip;
  }

  /**
   * Returns this port of this server to redirect to
   * @returns {Number}
   */
  get port () {
    return this._port;
  }

  /**
   * Returns the event bus for this server
   * @return {EventEmitter}
   */
  get eventBus () {
    return this._rakserver.userMessageHandler;
  }

  /**
   * Returns the zone ID associated with this server
   * @return {Number}
   */
  get zoneID () {
    return this._zoneID;
  }

  /**
   * Returns the root Manager of this server
   * @return {Manager}
   */
  get manager () {
    return this._manager;
  }

  /**
   * Returns the LUZ of this server
   * @return {LUZ}
   */
  get luz () {
    return this._luz;
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
        server._luz = new LUZ(new BitStream(file));
      });
  }

  /**
   * Broadcasts message to all clients connected
   * @param {BitStream} stream
   * @param {Number} reliability
   */
  broadcast (stream, reliability) {
    this._rakserver.connections.forEach(client => {
      client.send(stream, reliability);
    });
  }
}

module.exports = Server;
