class GenericManager {
  constructor (server) {
    this._server = server;
  }

  get eventBus () {
    return this._server.eventBus;
  }
}

module.exports = GenericManager;
