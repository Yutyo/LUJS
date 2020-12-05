import { Server } from '../../server/Server';

export default class GenericManager {
  #server: Server;

  constructor(server) {
    this.#server = server;
  }

  get eventBus() {
    return this.#server.eventBus;
  }
}
