/**
 * A class to manage managers
 */
import GenericManager from "./GenericManager";

export default class Manager {
  #managers: { [key: string]: GenericManager; };

  constructor () {
    this.#managers = {};
  }

  /**
   * Attaches a manager to the root manager
   * @param {string} name
   * @param {GenericManager} manager
   */
  attachManager (name : string, manager : GenericManager) : void {
    this.#managers[name] = manager;
  }

  /**
   * Retrieves a manager by name
   * @param name
   * @return {GenericManager}
   */
  getManager (name : string) : GenericManager {
    return this.#managers[name];
  }
}
