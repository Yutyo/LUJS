import GenericManager from './GenericManager';

export default class LWOOBJIDManager extends GenericManager {
  #start: number;

  constructor(server) {
    super(server);

    this.#start = 0xffff;
  }
}
