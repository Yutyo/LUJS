const xmlbuilder = require("xmlbuilder");

class CharData {
    constructor() {
        this._xml = xmlbuilder.create('root');
    }

    get xml() {
        return this._xml;
    }
}
