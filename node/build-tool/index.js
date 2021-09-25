#!/usr/bin/env node
/*
 *  index.js of built-tool
 *
 *   Build a new clucker.js and clucker.min.js for the current version in /dist
 *
 *
 *
 */
const path = require('path'),
buildTool = require( path.join(__dirname, 'lib/build-tool.js') );
// the uri of the file
let uri_build_conf = path.join(__dirname, '../../build-conf.json');
// build
buildTool.build(uri_build_conf)
.then((dist) => {
    console.log('dist folder created : ');
    console.log('path: ' + dist.dir_target);
})
.catch((e) => {
    console.log('ERROR:');
    console.log(e);
});
