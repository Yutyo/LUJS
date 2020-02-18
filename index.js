// TODO: Add something that automatically updates files from the repo

// Run the LU server...
const fs = require('fs');
const fse = require('fs-extra');

if(!fs.existsSync('config.json')) {
    console.info('Copying config.example.json to config.json...');
    fse.copySync('config.example.json', 'config.json');
}
const config = JSON.parse(fs.readFileSync('config.json'));
global.database = config.database;
global.cdclient = config.cdclient;

const Loader = require('./Loader');
Loader.setup(config);




// TODO: At some point I want an API server running...

// TODO: I also want Discord Rich Presence Integration?
