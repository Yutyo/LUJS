const GenericManager = require('./GenericManager').default;

class LWOOBJIDManager extends GenericManager {
  constructor (server) {
    super(server);

    this._start = 0xffff;
  }
}

module.exports = LWOOBJIDManager;
