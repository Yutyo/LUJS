import {Server} from "../../Server";

export default class GenericManager {
  #server: Server;

  constructor (server) {
    this.#server = server;
  }

  get eventBus () {
    return this.#server.eventBus;
  }
}
