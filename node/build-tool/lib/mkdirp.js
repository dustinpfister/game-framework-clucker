const fs = require('fs'),
path = require('path');

const mkdirp = {};

// mkdirp.cb(dir) : old cb style method by itself
mkdirp.cb = (p, cb) => {
    cb = cb || function() {} ;
    p = path.resolve(p);
    fs.mkdir(p, (e) => {
        if (!e) {
            cb(null);
        } else {
            if (e.code === 'ENOENT') {
                // if 'ENOENT' code error call mkdirp
                // again with the dirname of current dir
                mkdirp.cb(path.dirname(p), (e) => {
                    if (e) {
                        cb(e);
                    } else {
                        mkdirp.cb(p, cb);
                    }
                });
            } else {
                // if the folder is there, then we are good
                if(e.code === 'EEXIST'){
                    cb(null);
                }else{
                    // else some other error happed
                    cb(e);
                }
            }
        }
    });
};

// mkdirp.promise(dir) return a promise
mkdirp.promise = (p) => {
    return new Promise((resolve, reject)=>{
        mkdirp.cb(p, (e) => {
            if(e){
                reject(e);
            }else{
                resolve();
            }
        });
    });
};

module.exports = mkdirp;
