const Message = require('../Message');

class TransferToWorld extends Message {

    constructor() {
        super();
        this.ip = "";
        this.port = 0;
        this.mythranShift = false;
    }

    /**
     *
     * @param {BitStream}stream
     */
    deserialize(stream) {
        this.ip = stream.readString();
        this.port = stream.readShort();
        this.mythranShift = stream.readBoolean();
    }

    serialize(stream) {
        stream.writeString(this.ip);
        stream.writeShort(this.port);
        stream.writeBoolean(this.mythranShift);
    }
}

module.exports = TransferToWorld;