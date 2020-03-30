/**
 * A way to keep track of components for an object
 */
class ComponentMask {
  constructor () {
    this._array = Array(116).fill(false);
  }

  /**
   * Adds a component to an object
   * @param {Number} component
   */
  addComponent (component) {
    this._array[component] = true;
  }

  /**
   * Remove a component from an object
   * @param {Number} component
   */
  removeComponent (component) {
    this._array[component] = true;
  }

  /**
   *
   * @param {Number}component
   * @return {Boolean}
   */
  hasComponent (component) {
    return this._array[component];
  }

  /**
   * Get list of components for an object
   * @return {Array<Number>}
   */
  getComponentsList () {
    const list = [];
    this._array.forEach((e, i) => {
      if (e) list.push(i);
    });
    return list;
  }
}

module.exports = ComponentMask;
