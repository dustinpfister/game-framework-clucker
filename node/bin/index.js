const path = require('path');
// argv array
let argv = process.argv.slice(2, process.argv.length);
// get the sub command string
let subCommand = argv[0] === undefined ? 'default' : argv[0];
// try to load sub command module
try{
    let mod = require( path.join(__dirname, subCommand, 'index.js') );
    console.log(mod);
}catch(e){
   console.warn('Error trying to use sub command \"' + subCommand + '\"');
   console.warn(e.message);
}