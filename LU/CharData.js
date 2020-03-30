const xmlbuilder = require('xmlbuilder');
const InventoryType = require('./InventoryTypes');

class CharData {
  constructor () {
    this._xml = xmlbuilder.create('obj');
    this._xml.att('v', 1);

    // character
    this._char = this.xml.ele('char');
    this._mf = this.xml.ele('mf');
    this._level = this.xml.ele('lvl');

    // inventory
    this._inv = this._xml.ele('inv');

    this._items = this._inv.ele('items');

    this._container = [];
    this._container[InventoryType.items] = this._items.ele('in');
    this._container[InventoryType.items].att('t', InventoryType.items);
  }

  /**
   *
   * @param lot
   * @param id
   * @param slot
   * @param count
   * @param equipped
   * @param bound
   */
  addItem (lot, id, slot, count, equipped, bound) {
    const item = this._container[InventoryType.items].ele('i');
    item.att('l', lot);
    item.att('id', id);
    item.att('s', slot);
    // item.att('c', count);

    if (equipped) {
      item.att('eq', 1);
    }

    if (bound) {
      // item.att('b', 1);
    }
  }

  /**
   *
   * @param hairColor
   * @param hairStyle
   * @param shirtColor
   * @param pantsColor
   * @param leftHand
   * @param rightHand
   * @param eyebrowStyle
   * @param eyeStyle
   * @param mouthStyle
   */
  setMinifigureData (
    hairColor,
    hairStyle,
    shirtColor,
    pantsColor,
    leftHand,
    rightHand,
    eyebrowStyle,
    eyeStyle,
    mouthStyle
  ) {
    this._mf.att('hc', hairColor);
    this._mf.att('hs', hairStyle);
    this._mf.att('hd', 0);
    this._mf.att('t', shirtColor);
    this._mf.att('l', pantsColor);
    this._mf.att('hdc', 0);
    this._mf.att('cd', 21); // no clue why this is 21, retrieved from other xml
    this._mf.att('lh', leftHand);
    this._mf.att('rh', rightHand);
    this._mf.att('es', eyebrowStyle);
    this._mf.att('ess', eyeStyle);
    this._mf.att('ms', mouthStyle);
  }

  /**
   *
   * @param accountID
   * @param currency
   * @param gm
   * @param ftp
   */
  setCharacterData (accountID, currency, gm, ftp) {
    this._char.att('acct', accountID);
    this._char.att('cc', currency);
    this._char.att('gm', gm);
    this._char.att('ft', ftp);
  }

  setDestructibleInformation (
    healthMaximum,
    healthCurrent,
    imaginationMaximum,
    imaginationCurrent,
    armorMaximum,
    armorCurrent
  ) {}

  /**
   *
   * @param level
   */
  setLevelInformation (level) {
    this._level.att('l', level);
    this._level.att('cv', 1);
    this._level.att('sb', 500);
  }

  get xml () {
    return this._xml;
  }
}

module.exports = CharData;
