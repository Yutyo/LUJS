class LDF {
    constructor() {
        this._ldf = [];
    }

    addWString(key, value) {
        this._ldf.push({
            key: key,
            type: 0,
            value: value
        });
    }

    addSignedLong(key, value) {
        this._ldf.push({
            key: key,
            type: 1,
            value: value
        });
    }

    addFloat(key, value) {
        this._ldf.push({
            key: key,
            type: 3,
            value: value
        });
    }

    addDouble(key, value) {
        this._ldf.push({
            key: key,
            type: 4,
            value: value
        });
    }

    addLong(key, value) {
        this._ldf.push({
            key: key,
            type: 5,
            value: value
        });
    }

    addBoolean(key, value) {
        this._ldf.push({
            key: key,
            type: 7,
            value: value
        });
    }

    addSignedLongLong(key, value) {
        this._ldf.push({
            key: key,
            type: 8,
            value: value
        });
    }

    addLWOOBJID(key, value) {
        this._ldf.push({
            key: key,
            type: 9,
            value: value
        });
    }

    addByteString(key, value) {
        this._ldf.push({
            key: key,
            type: 13,
            value: value
        });
    }

    serialize(stream) {
        stream.writeLong(this._ldf.length);
        for(let i = 0; i < this._ldf.length; i ++) {
            let ldf = this._ldf[i];
            stream.writeByte(ldf.key.length * 2);
            for(let k = 0; k < ldf.key.length; k ++) {
                stream.writeShort(ldf.key.charCodeAt[k]);
            }
            stream.writeByte(ldf.type);
            switch(ldf.type) {
                case 0:
                    stream.writeLong(ldf.value.length);
                    for(let k = 0; k < ldf.value.length; k ++) {
                        stream.writeShort(ldf.value.charCodeAt[k]);
                    }
                    break;
                case 1:
                    // TODO: Not implemented yet
                    // stream.writeSignedLong(ldf.value);
                    break;
                case 3:
                    stream.writeFloat(ldf.value);
                    break;
                case 4:
                    //TODO: Not implemented yet
                    // stream.writeDouble(ldf.value);
                    break;
                case 5:
                    stream.writeLong(ldf.value);
                    break;
                case 7:
                    stream.writeBoolean(ldf.value);
                    break;
                case 8:
                    stream.writeLongLong(ldf.value);
                    break;
                case 9:
                    ldf.value.serialize(stream);
                    break;
                case 13:
                    stream.writeByte(ldf.value.length);
                    for(let k = 0; k < ldf.value.length; k ++) {
                        stream.writeByte(ldf.value.charCodeAt[k]);
                    }
                    break;
            }
        }
    }
}

module.exports = LDF;