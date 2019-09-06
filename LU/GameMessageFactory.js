const GameMessage = require('lugamemessages/GameMessages').GameMessages;

class GameMessageFactory {
    /**
     *
     * @param {Number} ID
     * @param {Object} properties
     */
    static makeMessage(ID, properties = {}) {
        let gm = GameMessage[ID];
        if(gm !== undefined) {
            let toRet = new LUGameMessage(ID);
            return toRet;
        }
    }

    /**
     * Create a GM from an ID and the stream containing the data
     * @param id
     * @param stream
     */
    static generateMessageFromBitStream(id, stream) {
        let toRet = new LUGameMessage(id);
        toRet.deserialize(stream);
        return toRet;
    }
}

class LUGameMessage {
    /**
     *
     * @param {Number} id
     */
    constructor(id) {
        this._id = id;
        this._data = {};
        /*
        * {
        *   name: {String}
        *   type: [bit, byte... long long]
        * }
        * */
    }

    /**
     *
     * @param {BitStream} stream
     */
    serialize(stream) {
        stream.writeShort(this._id);
    }

    /**
     *
     * @param {BitStream} stream
     */
    deserialize(stream) {
        let structure = GameMessage[this._id];

        for (let name in structure) {
            if (!structure.hasOwnProperty(name)) continue;

            switch(structure[name].type) {
                case 'int':
                    this._data[name] = stream.readLong();
                    break;
                case 'wstring':
                    let temp = "";
                    let length = stream.readLong();
                    for(let i = 0; i < length; i ++) {
                        temp += String.fromCharCode(stream.readShort());
                    }
                    this._data[name] = temp;
                    break;
            }
        }
    }

    get properties() {
        return this._data;
    }
}

module.exports = GameMessageFactory;