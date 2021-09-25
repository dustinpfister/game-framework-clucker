const UglifyJS = require("uglify-js"),
path = require('path'),
fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile),
mkdirp = require( path.join(__dirname, 'mkdirp.js') );


const api = {};

// read a build-conf.json file to produce an opt object for buildTool.createSource
api.readConf = (uri) => {
    let opt = {};
    return readFile(uri, 'utf8')
    .then((text) => {
        let conf = {};
        // try to parse JSON
        try{
            conf = JSON.parse(text);
        }catch(e){}
        // set up opt with what is in JSON or hard coded default
        // RESOLVE opt.dir_root TO AN ABSOLUTE PATH from the location of the conf.json file
        opt.dir_root = path.resolve( path.join( path.dirname(uri), conf.dir_root)) || process.cwd();
        // RESOLVE opt.dir_target TO AN ABSOLUTE PATH from opt.dir_root
        opt.dir_target = path.resolve( path.join( opt.dir_root, conf.dir_target || './dist') );
        opt.fileName = conf.fileName || 'file';
        opt.version = conf.version === undefined ? '' : conf.version;
        opt.sourceFiles = conf.sourceFiles || [];
        // top and bottom strings
        opt.top = conf.top || '';
        opt.bottom = conf.bottom || '';




        return readFile( path.join(opt.dir_root, 'package.json') );
    })
    .then((packageText)=>{
        let pkg = {};
        // try to parse JSON
        try{
            pkg = JSON.parse(packageText);
        }catch(e){}
        opt.version = pkg.version || opt.version;
        opt.author = pkg.author || '';


opt.bottom = "\n}(this['Clucker'] = {ver:'" + opt.version + "'}));"


        // append version folder to dir_target
        if(opt.version){
            opt.dir_target = path.join(opt.dir_target, opt.version);
        }
        return opt;
    }).
    catch((e) => {
        return opt;
    });
};

// return a promise that will resolve to an object with code and error properties
// using an options object created directly or with buildTool.readConf. The options
// object should have at least a dir_root, and sourceFiles array
api.createSource = (opt) => {
    opt = opt || {};
    // dir_root should be whatever is given. The buildTool.readConf method should resolve this
    // to an absolute path. When using this method directly you should have the freedom to set this
    // to any path value.
    opt.dir_root = opt.dir_root || process.cwd();
    // there should be a sourceFiles array that is an array of relative paths
    // from opt.dir_root to each source code file
    return Promise.all(opt.sourceFiles.map((uri_source)=>{
        return readFile( path.join(opt.dir_root, uri_source), 'utf8' );
    }))
    .then((codeArray) => {
        return {
            error: null,
            code: codeArray.join('')
        };
    }).catch((e)=>{
        return {
            error: e,
            code: ''
        };
    });
};

// create a dist object
api.createDistObj = (opt) => {
    opt = opt || {};
    // the starting dist object
    let dist = {
        fileName : opt.fileName || 'file',
        dir_root: opt.dir_root || process.cwd(),
        // dist.dir_target should be a realtive path from opt.dir_root
        dir_target: opt.dir_target, //path.join(opt.dir_root, opt.dir_target || 'dist'),
        sourceCode : opt.sourceCode || '',
        minCode : '',
        top: opt.top || '',
        bottom: opt.bottom || '',
        error: null
    };

    // try to use uglify.js and set dist.minCode or dist.error
    let ugly = UglifyJS.minify(dist.sourceCode);
    if(ugly.error){
        dist.error = ugly.error;
    }else{
        dist.minCode = ugly.code;
    }
    // return the dist object
    return dist;
};

// write th given dist object to the dist.dir_target path
api.writeDist = (dist) => {
    let dir_target = path.join( dist.dir_target );
    // first make sure the target folder is there
    return mkdirp.promise(dir_target)
    // write the dev version
    .then(() => {
        let text = dist.top + dist.sourceCode + dist.bottom;
        return writeFile( path.join( dir_target, dist.fileName + '.js' ), text, 'utf8' );
    })
    // write the min version
    .then(()=>{
        let text = dist.top + dist.minCode + dist.bottom;
        return writeFile( path.join( dir_target, dist.fileName + '.min.js' ), text, 'utf8' );
    }).
    then(()=>{
        return dist;
    });
};

// build by passing a uri to conf
api.build = function(uri_build_conf){
    let opt = {};
    // start by reading the json file
    return api.readConf(uri_build_conf)
    // append build-conf.json values to opt and create source
    .then((conf)=>{
        opt = Object.assign(opt, conf);
        return api.createSource(opt);
    })
    // append opt.sourceCode and create dist options by calling createDist
    // then write dist
    .then((source)=>{
        opt.sourceCode = source.code;
        let dist = api.createDistObj(opt);
        return api.writeDist(dist);
    });
};

module.exports = api;
