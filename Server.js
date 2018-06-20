class Server {
    /**
     *
     * @param {RakServer} rakserver
     * @param {Number} zoneID
     */
    constructor(rakserver, zoneID) {
        this._rakserver = rakserver;
        this._zoneID = zoneID;
        let server = this;
        this._rakserver.getServer = function() {
            return server;
        }
    }

    get rakServer() {
        return this._rakserver;
    }

    get zoneID() {
        return this._zoneID;
    }
}

module.exports = Server;