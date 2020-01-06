const xmlbuilder = require("xmlbuilder");
const InventoryType = require('./InventoryTypes');

class CharData {
    constructor() {
        this._xml = xmlbuilder.create('obj');
        this._xml.att('v', 1);

        // character
        let char = this.xml.ele('char');

        // inventory
        this._inv = this._xml.ele('inv');

        let bag = this._inv.ele('bag');
        bag.ele('b').att('t', 0).att('m', 20);

        this._inv.ele('grps');
        this._items = this._inv.ele('items');
        this._items.att('nn', 1);

        this._container = [];
        this._container[InventoryType.items] = this._items.ele('in');
        this._container[InventoryType.items].att('t', InventoryType.items);
    }

    addItem(lot, id, slot, count, equipped, bound) {
        let item = this._container[InventoryType.items].ele('i');
        item.att('l', lot);
        item.att('id', id);
        item.att('s', slot);
        item.att('c', count);

        if(equipped) {
            item.att('eq', 1);
        }

        if(bound) {
            item.att('b', 1);
        }
    }

    get xml() {
        return this._xml;
    }
}

module.exports = CharData;
