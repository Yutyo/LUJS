const readline = require('readline');
const User = require('./DB/LUJS').User;
const util = require('util');
const bcrypt = require('bcryptjs');
const { servers } = require('./ServerManager');
const sequelize = require('./DB/LUJS').sequelize;
const bcryptHash = util.promisify(bcrypt.hash);

let instance;

class Commands {
  /**
   *
   * @returns {Commands}
   */
  static instance () {
    if (instance === undefined) {
      instance = new Commands();
    }

    return instance;
  }

  constructor () {
    this._read = readline.createInterface(process.stdin);

    const com = this;
    this._read.on('line', input => {
      com.handleInput(input);
    });
  }

  /**
   *
   * @param {String} input
   */
  handleInput (input) {
    if (input.charAt(0) === '/') {
      this.parseCommand(input.substring(1));
    }
  }

  /**
   *
   * @param {String} input
   */
  parseCommand (input) {
    const commandAndArgs = input.split(' ');
    this.handleCommand(commandAndArgs[0], commandAndArgs.splice(1));
  }

  /**
   * TODO: actually use some event handler or something instead of a switch statement
   * @param {String} command
   * @param {Array<String>} args
   */
  handleCommand (command, args) {
    switch (command) {
      case 'create-account':
        bcryptHash(args[1], 10)
          .then(hash => {
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
        servers.forEach(server => {
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

module.exports = Commands;
