const GameMessage = require('lugamemessages/GameMessages').GameMessages;
const GameMessageKey = require('lugamemessages/GameMessages').GameMessageKey;

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
            toRet.properties = properties;
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

        let structure = GameMessage[this._id];

        for (let name in structure) {
            if (!structure.hasOwnProperty(name)) continue;

            if(structure[name].default !== undefined) {
                if(this._data[name] === undefined) {
                    // if the data is omitted then we just use default values
                    if(structure[name].type !== 'bit') {
                        stream.writeBit(false);
                    } else {
                        stream.writeBit(structure[name].default);
                    }
                    continue;
                } else {
                    if(structure[name].type !== 'bit') {
                        stream.writeBit(true);
                    }
                }
            } else {
                // if there is no default then if we don't have data defined for this field we need to throw an error
                if(this._data[name] === undefined) {
                    throw Error(name + " was not provided when creating game message " + GameMessageKey.key(this._id));
                }
            }

            switch(structure[name].type) {
                case 'bit':
                    stream.writeBit(this._data[name]);
                    break;
                case 'int':
                    stream.writeLong(this._data[name]);
                    break;
                case 'float':
                    stream.writeFloat(this._data[name]);
                    break;
            }
        }
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

    /**
     *
     * @param properties
     */
    set properties(properties) {
        this._data = properties
    }
}

module.exports = GameMessageFactory;