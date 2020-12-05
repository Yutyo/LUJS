import * as readline from 'readline';
import { User, sequelize } from '../DB/LUJS';
import * as util from 'util';
import * as bcrypt from 'bcryptjs';
import { servers } from './ServerManager';
const bcryptHash = util.promisify(bcrypt.hash);

let instance;

export default class Commands {
  #read: readline.Interface;

  /**
   *
   * @returns {Commands}
   */
  static instance() {
    if (instance === undefined) {
      instance = new Commands();
    }

    return instance;
  }

  constructor() {
    this.#read = readline.createInterface(process.stdin);

    this.#read.on('line', (input) => {
      this.handleInput(input);
    });
  }

  /**
   *
   * @param {String} input
   */
  handleInput(input) {
    if (input.charAt(0) === '/') {
      this.parseCommand(input.substring(1));
    }
  }

  /**
   *
   * @param {String} input
   */
  parseCommand(input) {
    const commandAndArgs = input.split(' ');
    this.handleCommand(commandAndArgs[0], commandAndArgs.splice(1));
  }

  /**
   * TODO: actually use some event handler or something instead of a switch statement
   * @param {String} command
   * @param {Array<String>} args
   */
  handleCommand(command, args) {
    switch (command) {
      case 'create-account':
        bcryptHash(args[1], 10)
          .then((hash) => {
            User.create({
              username: args[0],
              password: hash,
              email: '',
              first_name: '',
              last_name: '',
              birthdate: ''
            })
              .then(() => {
                console.log(`Created user: ${args[0]} ${hash}`);
              })
              .catch(() => {
                console.error('Failed to create account: DB Error');
              });
          })
          .catch(() => {
            console.error('Failed to create account: Hash failed');
          });
        break;
      case 'list-servers':
        servers.forEach((server) => {
          console.log(
            `Server: ${server.rakServer.ip}:${server.rakServer.port} Zone: ${server.zoneID}`
          );
        });
        break;
      case 'rebuild-database':
        sequelize.sync({ force: true });
        break;
    }
  }
}
