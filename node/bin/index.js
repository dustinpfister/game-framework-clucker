const path = require('path');
// argv array
let argv = process.argv.slice(2, process.argv.length);
// get the sub command string
let subCommand = argv[0] === undefined ? 'default' : argv[0];
// try to load sub command module
try{
    // load the module for the sub command
    let mod = require( path.join(__dirname, subCommand, 'index.js') );
    // create the api object to work with in the sub command module
    let api = {
        argv: argv,
        subCommand: subCommand,
        dir_clucker: path.join(__dirname, '../../'),
        dir_bin: __dirname,
        dir_cwd: process.cwd()
    };
    // call the main method of the sub command module passing the api
    mod(api);
}catch(e){
   console.warn('Error trying to use sub command \"' + subCommand + '\"');
   console.warn(e.message);
}