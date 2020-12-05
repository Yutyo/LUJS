/**
 * A way to keep track of components for an object
 */
export default class ComponentMask {
  #array: Array<boolean>;

  constructor() {
    this.#array = Array(116).fill(false);
  }

  /**
   * Adds a component to an object
   * @param {number} component
   */
  addComponent(component: number) {
    this.#array[component] = true;
  }

  /**
   * Remove a component from an object
   * @param {Number} component
   */
  removeComponent(component: number) {
    this.#array[component] = false;
  }

  /**
   *
   * @param {Number}component
   * @return {Boolean}
   */
  hasComponent(component: number) {
    return this.#array[component];
  }

  /**
   * Get list of components for an object
   * @return {Array<Number>}
   */
  getComponentsList() {
    const list = [];
    this.#array.forEach((e, i) => {
      if (e) list.push(i);
    });
    return list;
  }
}
