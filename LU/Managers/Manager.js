/**
 * A class to manage managers
 */
class Manager {
    constructor() {
        /**
         *
         * @type {{GenericManager}}
         */
        this.managers = {};
    }

    /**
     * Attaches a manager to the root manager
     * @param {String} name
     * @param {GenericManager} manager
     */
    attachManager(name, manager) {
        this.managers[name] = manager;
    }

    /**
     * Retrieves a manager by name
     * @param name
     * @return {GenericManager}
     */
    getManager(name) {
        return this.managers[name];
    }
}

module.exports = Manager;