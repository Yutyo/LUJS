class LWOOBJID {
    constructor(top, bottom) {
        this._top = top;
        this._bottom = bottom;
    }

    get low() {
        return this._bottom;
    }

    get high() {
        return this._top;
    }

    serialize(stream) {
        stream.writeLong(this._bottom);
        stream.writeLong(this._top);
    }

    deserialize(stream) {
        this._bottom = stream.readLong();
        this._top = stream.readLong();
    }
}

module.exports = LWOOBJID;