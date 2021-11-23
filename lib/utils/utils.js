try{
    // append to Clucker global if there, else stand alone as utils global
    if(Clucker){
        var utils = Clucker.utils = {};
    }else{
        var utils = {};
    }
}catch(e){
    var utils = {};
}




/********* ********** ********** *********/
//  MISCELLANEOUS METHODS
/********* ********** ********** *********/

// no operation ref
utils.noop = function () {};

// distance
utils.distance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

// bounding box
utils.boundingBox = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
        y1 + h1 < y2 ||
        y1 > y2 + h2 ||
        x1 + w1 < x2 ||
        x1 > x2 + w2);
};

// mathematical modulo
utils.mod = function (x, m) {
    return (x % m + m) % m;
};

// format money method
utils.formatNumber = function(number){
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0 // (causes 2500.99 to be printed as $2,501)
    });
    return formatter.format(number); /* $2,500.00 */
};

// get a value by way of a per value (0-1), and a min and max value
utils.valueByRange = function(per, nMin, nMax){
    per = per === undefined ? 0 : per;
    nMin = nMin === undefined ? 0 : nMin;
    nMax = nMax === undefined ? 1 : nMax;
    return nMin + Math.round(per * (nMax - nMin));
};

/********* ********** ********** *********/
//  TEXT
/********* ********** ********** *********/

// wrap text to an array of substrings
// based off of this: https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
utils.wrapText = function(str, width){
    var patt = new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g');
    return str.replace(patt, '$1\n').split('\n');
};




/********* ********** ********** *********/
//  HTTP
 /********* ********** ********** *********/

// very simple http client
utils.http = function(opt){
    var opt = opt || {};
    // default options
    opt.url = opt.url || '';
    opt.method = opt.method || 'GET';
    opt.async = opt.async === undefined ? true: opt.async;
    opt.body = opt.body === undefined ? null: opt.body;
    opt.onDone = opt.onDone || utils.noop;
    opt.onError = opt.onError || utils.noop;
    opt.responseType = opt.responseType || '';  // set to 'blob' for png
    // create and set up xhr
    var xhr = new XMLHttpRequest();
    xhr.responseType = opt.responseType;
    xhr.open(opt.method, opt.url, opt.async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if(xhr.status >= 200 && xhr.status < 400){
                opt.onDone.call(xhr, xhr.response, xhr);
            }else{
                opt.onError.call(xhr, xhr);
            }
        }
    };


    // send
    xhr.send(opt.body);
};

// load just a png file, this calls utils.http with proper settings, and the response is an Image
utils.httpPNG = function(opt){
    opt = opt || {};
    opt.onDone = opt.onDone || utils.noop;
    opt.onError = opt.onError || utils.noop;
    utils.http({
        url: opt.url,
        responseType: 'blob',
        onDone : function(res, xhr){
            var imageURL = window.URL.createObjectURL(res);
            var image = new Image();
            image.src = imageURL;
            // need to do an unload for this
            image.addEventListener('load', function(){
                opt.onDone.call(xhr, image, xhr);
            });
        },
        onError: opt.onError
    });
};




/********* ********** ********** *********/
//  BASIC EXP SYSTEM
 /********* ********** ********** *********/

// Basic experience point system methods
utils.XP = (function () {
    // default values
    var default_deltaNext = 50,
    defualt_cap = 100;
    // get level with given xp
    var getLevel = function (xp, deltaNext) {
        deltaNext = deltaNext === undefined ? default_deltaNext : deltaNext;
        return (1 + Math.sqrt(1 + 8 * xp / deltaNext)) / 2;
    };
    // get exp to the given level with given current_level and xp
    var getXP = function (level, deltaNext) {
        deltaNext = deltaNext === undefined ? default_deltaNext : deltaNext;
        return ((Math.pow(level, 2) - level) * deltaNext) / 2;
    };
    // parse a levelObj by XP
    var parseByXP = function (xp, cap, deltaNext) {
        //cap = cap === undefined ? default_cap : cap;
        var l = getLevel(xp, deltaNext);
        l = l > cap ? cap : l;
        var level = Math.floor(l),
        forNext = getXP(level + 1, deltaNext);
        return {
            level: level,
            levelFrac: l,
            per: l % 1,
            xp: xp,
            forNext: l === cap ? Infinity : forNext,
            toNext: l === cap ? Infinity : forNext - xp
        };
    };
    return {
        // use getXP method and then pass that to parseXP for utils.XP.parseByLevel
        parseByLevel: function (l, cap, deltaNext) {
            return parseByXP(getXP(l, deltaNext), cap, deltaNext);
        },
        // can just directly use parseByXP for utils.XP.parseByXP
        parseByXP: parseByXP
    };
}
    ());
/********* ********** ********** *********/
//  LOGGING
/********* ********** ********** *********/

// basic utils.log method
utils.log = function (mess) {
    console.log(mess);
};

// log for test  ex: utils.logFor( obj.hp, obj.hp < 0 || obj.hp < obj.hpMax )
utils.logFor = function (mess, test, opt) {
    opt = opt || {};
    opt.log = opt.log || utils.log;
    if (test) {
        opt.log(mess);
    }

};

// log just once by default, but can be reset, and maxCount can be adjusted
utils.logOnce = (function () {
    var count = 0;
    return function (mess, opt) {
        opt = opt || {};
        opt.log = opt.log || utils.log;
        opt.maxCount = opt.maxCount === undefined ? 1 : opt.maxCount;
        opt.resetCount = opt.resetCount === undefined ? false : opt.resetCount;
        if (opt.resetCount) {
            count = 0;
        }
        if (count < opt.maxCount) {
            opt.log(mess);
            count += 1;
        }
    };
}
    ());

/********* ********** ********** *********/
//  OBJECTS
/********* ********** ********** *********/

// a deep clone method that should work in most situations
utils.deepClone = (function () {
    // forInstance methods supporting Date, Array, and Object
    var forInstance = {
        Date: function (val, key) {
            return new Date(val.getTime());
        },
        Array: function (val, key) {
            // deep clone the object, and return as array
            var obj = utils.deepClone(val);
            obj.length = Object.keys(obj).length;
            return Array.from(obj);
        },
        Object: function (val, key) {
            return utils.deepClone(val);
        }
    };
    // default forRecursive
    var forRecursive = function (cloneObj, sourceObj, sourceKey) {
        return cloneObj;
    };
    // default method for unsupported types
    var forUnsupported = function (cloneObj, sourceObj, sourceKey) {
        // not supported? Just ref the object,
        // and hope for the best then
        return sourceObj[sourceKey];
    };
    // return deep clone method
    return function (obj, opt) {
        var clone = {},
        conName,
        forIMethod; // clone is a new object
        opt = opt || {};
        opt.forInstance = opt.forInstance || {};
        opt.forRecursive = opt.forRecursive || forRecursive;
        opt.forUnsupported = opt.forUnsupported || forUnsupported;
        for (var i in obj) {
            // if the type is object and not null
            if (typeof(obj[i]) == "object" && obj[i] != null) {
                // recursive check
                if (obj[i] === obj) {
                    clone[i] = opt.forRecursive(clone, obj, i);
                } else {
                    // if the constructor is supported, clone it
                    conName = obj[i].constructor.name;
                    forIMethod = opt.forInstance[conName] || forInstance[conName];
                    if (forIMethod) {
                        clone[i] = forIMethod(obj[i], i);
                    } else {
                        clone[i] = opt.forUnsupported(clone, obj, i);
                    }
                }
            } else {
                // should be a primitive so just assign
                clone[i] = obj[i];
            }
        }
        return clone;
    };
}
    ());

// traverse an object
utils.traverse = function (obj, forKey, level) {
    level = level || 1;
    for (var i in obj) {
        // call forKey for every key found
        forKey.call(obj[i], obj[i], i, typeof obj[i], level, obj);
        // call utils.traverse recursively if type is object and not null
        if (typeof obj[i] === 'object' && obj[i] != null) {
            nextLevel = level + 1;
            utils.traverse(obj[i], forKey, nextLevel);
        }
    }
    return null;
};