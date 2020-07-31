import * as xmlbuilder from 'xmlbuilder';
import { InventoryTypes } from './InventoryTypes';

class CharData {
  #xml: xmlbuilder.XMLElement;
  #items;
  #char;
  #mf;
  #level;
  #inv;
  #container;

  constructor() {
    this.#xml = xmlbuilder.create('obj');
    this.#xml.att('v', 1);

    // character
    this.#char = this.#xml.ele('char');
    this.#mf = this.#xml.ele('mf');
    this.#level = this.#xml.ele('lvl');

    // inventory
    this.#inv = this.#xml.ele('inv');

    this.#items = this.#inv.ele('items');

    this.#container = [];
    this.#container[InventoryTypes.items] = this.#items.ele('in');
    this.#container[InventoryTypes.items].att('t', InventoryTypes.items);
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
  addItem(lot, id, slot, count, equipped, bound) {
    const item = this.#container[InventoryTypes.items].ele('i');
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
  setMinifigureData(
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
    this.#mf.att('hc', hairColor);
    this.#mf.att('hs', hairStyle);
    this.#mf.att('hd', 0);
    this.#mf.att('t', shirtColor);
    this.#mf.att('l', pantsColor);
    this.#mf.att('hdc', 0);
    this.#mf.att('cd', 21); // no clue why this is 21, retrieved from other xml
    this.#mf.att('lh', leftHand);
    this.#mf.att('rh', rightHand);
    this.#mf.att('es', eyebrowStyle);
    this.#mf.att('ess', eyeStyle);
    this.#mf.att('ms', mouthStyle);
  }

  /**
   *
   * @param accountID
   * @param currency
   * @param gm
   * @param ftp
   */
  setCharacterData(accountID, currency, gm, ftp) {
    this.#char.att('acct', accountID);
    this.#char.att('cc', currency);
    this.#char.att('gm', gm);
    this.#char.att('ft', ftp);
  }

  setDestructibleInformation(
    healthMaximum,
    healthCurrent,
    imaginationMaximum,
    imaginationCurrent,
    armorMaximum,
    armorCurrent
  ) {
    // TODO
  }

  /**
   *
   * @param level
   */
  setLevelInformation(level) {
    this.#level.att('l', level);
    this.#level.att('cv', 1);
    this.#level.att('sb', 500);
  }

  get xml() {
    return this.#xml;
  }
}

module.exports = CharData;
