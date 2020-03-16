const readline = require('readline');
const User = require('./DB/LUJS').User;
const bcrypt = require('bcryptjs');

let instance;

class Commands {

    /**
     *
     * @returns {Commands}
     */
    static instance() {
        if(instance === undefined) {
            instance = new Commands();
        }

        return instance;
    }

    constructor() {
        this._read = readline.createInterface(process.stdin);

        let com = this;
        this._read.on('line', (input) => {com.handleInput(input)});
    }

    /**
     *
     * @param {String} input
     */
    handleInput(input) {
        if(input.charAt(0) === '/') {
            this.parseCommand(input.substring(1));
        }
    }

    /**
     *
     * @param {String} input
     */
    parseCommand(input) {
        let commandAndArgs = input.split(' ');
        this.handleCommand(commandAndArgs[0], commandAndArgs.splice(1));
    }

    /**
     * TODO: actually use some event handler or something instead of a switch statement
     * @param {String} command
     * @param {Array<String>} args
     */
    handleCommand(command, args) {
        switch (command) {
            case 'create-account': {
                bcrypt.hash(args[1], 10, function(err, hash) {
                    User.create({
                        username: args[0],
                        password: hash,
                        email: "",
                        first_name: "",
                        last_name: "",
                        birthdate: ""
                    }).then(() => {
                        console.log(`Created user: ${args[0]} ${hash}`);
                    });
                });

            }
        }
    }

}

module.exports = Commands;