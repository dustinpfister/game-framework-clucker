# nodejs-simple-build-tool

This is my take on a simple nodejs build tool for the sake of creating a dist folder from a collection of source code files. I do not care to make something that is packed with features for this one, I just want a basic tool that will work, and move on with things. 

Event when it comes to keeping this basic the process of this should still be as follows.

* have a build-config.json file that will hold settings for the build process
* build-config.json should have a dir\_root prop to set what the root path is relative to the build-conf.json file
* build-config.json should have a dir\_target prop that is the output folder relative to dir_root
* build-config.json should have a sourceFiles prop that is a list of paths relative to dir_root to soucre code files
* build-config.json should have a fileName prop that is the fileName to use for the output files
* if a package.json file is found a version, license, and author prop will be used in place of build-config settings for these values
* write a development output javaScript file to an output location such as /dist/\[Project.name\].js
* minify the development output, and write it to a location like /dist/\[Project.name\]min.js

## The build.conf JSON file format

So far the format of the build-conf-json file looks something like this

```json
{
  "fileName": "test_script",
  "dir_root": "./",
  "dir_target": "./dist",
  "topString": "",
  "bottomString": "",
  "sourceFiles": [
     "./src/file1.js", "./src/file2.js", "./src/file3.js"
  ]
}
```

A version property can also be set, if a package.json file is in the same folder as build-conf the version number there will be used.

## Uisng this build tool

This project as of this writing is still some what of a work in progress. Still I think I should take a moment to write down how to use 0.1.0 of the build-tool thus far.

### Using from the command line

Clone the repo down and do an npm install

```bash
$ git clone --depth 1 https://github.com/dustinpfister/nodejs-simple-build-tool
$ cd nodejs-simple-build-tool
$ npm install
```

The dist folder can then be built for the demo by calling index.js file and giving the location of the build-conf json file. So then from the root folder of this project folder something like this should work.

```bash
$ node index demo/build-conf.json
```

The build-conf.json file as well as the other assets can be thought of as an example for how this will work

### Using from another script

I will not be taking the time to write about the full api at this time as a lot might change. However there is always looking at the index.js file in the root of this folder to get an idea.

```js
const path = require('path'),
buildTool = require( path.join(__dirname, 'lib/build-tool.js') );
// the uri of the file
let uri_build_conf = process.argv[2] ||  path.join(process.cwd(), 'build-conf.json');
// the options object
let opt = {};
// start by reading the json file
buildTool.readConf(uri_build_conf)
// append build-conf.json values to opt and create source
.then((conf)=>{
   opt = Object.assign(opt, conf);
   return buildTool.createSource(opt);
})
// append opt.sourceCode and create dist options by calling createDist
// then write dist
.then((source)=>{
   opt.sourceCode = source.code;
   let dist = buildTool.createDistObj(opt);
   return buildTool.writeDist(dist);
})
.then((dist) => {
    console.log('dist folder created : ');
    console.log('path: ' + dist.dir_target);
})
.catch((e) => {
    console.log(e);
});
```

## Going with uglify to Minify JavaScript code

I decided to [go with uglify](https://www.npmjs.com/package/uglify-js) for this. I have not done a great deal of testing with the dependency however it does produce a desired output for what I want this kind of dependency for.

This development input:

```js
var gameMod = (function () {
    // public API
    var api = {};
    // a private method
    var add = function (a, b) {
        return a + b;
    };
    // a pubic API method
    api.func1 = function (a, b) {
        return a + b;
    }
    // return the public api
    return api;
}
    ())

```

results in this output after running it threw uglify:

```js
var gameMod=function(){var n={};return n.func1=function(n,r){return n+r},n}();
```
