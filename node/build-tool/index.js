const path = require('path'),
buildTool = require( path.join(__dirname, 'lib/build-tool.js') );
// the uri of the file
//let uri_build_conf = process.argv[2] ||  path.join(process.cwd(), 'build-conf.json');

let uri_build_conf = path.join(__dirname, '../../build-conf.json');

/*
buildTool.readConf(uri_build_conf)
.then((a) => {
    console.log(a);
})
.catch((e) => {
    console.log('ERROR:');
    console.log(e);
});
*/

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
