const GenericManager = require('./GenericManager');

class LWOOBJIDManager extends GenericManager {
    constructor(server) {
        super(server);

        this._start = 0xFFFF;
    }
}

module.exports = LWOOBJIDManager;