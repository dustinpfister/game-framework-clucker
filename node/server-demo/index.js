#!/usr/bin/env node
/*
 *  index.js
 *
 *   start server to host the root of this project folder
 *
 *   ex: $ node index.js 8080
 *
 */

let spawn = require('child_process').spawn,
path = require('path'),

uri_root = path.join(__dirname, '../../'),
uri_server = path.join(__dirname, 'server.js')

let ls = spawn('node', [uri_server, uri_root, process.argv[2] || '8080']);

ls.stdout.on('data', function(data){
    console.log(data.toString());
});

ls.stderr.on('data', function(data){
    console.log(data.toString());
});

ls.on('exit', function (code) {
  console.log('Child process exited with exit code ' + code);
});
