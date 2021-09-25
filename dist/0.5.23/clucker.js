(function(Clucker){

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
				
				//console.log(image);
				
                opt.onDone.call(xhr, image, xhr);
            });
        },
        onError: opt.onError
    });
};

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
        var l = getLevel(xp);
        l = l > cap ? cap : l;
        var level = Math.floor(l),
        forNext = getXP(level + 1);
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
            return parseByXP(getXP(l, deltaNext), cap);
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
poolMod = (function () {
    // Public API
    var api = {};
    // get next inactive object in the given pool
    var getInactive = function (pool) {
        var i = pool.objects.length,
        obj;
        while (i--) {
            obj = pool.objects[i];
            if (!obj.active) {
                return obj;
            }
        }
        return false;
    };
    // create a new pool
    api.create = function (opt) {
        opt = opt || {};
        opt.count = opt.count || 10;
        var i = 0,
        pool = {
            objects: [],
            secsCap: opt.secsCap === undefined ? Infinity : opt.secsCap,
            disableLifespan: opt.disableLifespan || false,
            data: opt.data || {},
            spawn: opt.spawn || function (obj, pool, state, opt) {},
            purge: opt.purge || function (obj, pool, state) {},
            update: opt.update || function (obj, pool, state, secs) {}
        };
        while (i < opt.count) {
            pool.objects.push({
                active: false,
                i: i,
                x: opt.x === undefined ? 0 : opt.x,
                y: opt.y === undefined ? 0 : opt.y,
                w: opt.w === undefined ? 32 : opt.w,
                h: opt.h === undefined ? 32 : opt.h,
                heading: opt.heading === undefined ? 0 : opt.heading,
                pps: opt.pps === undefined ? 32 : opt.pps,
                lifespan: opt.lifespan || 3,
                data: {}
            });
            i += 1;
        }
        return pool;
    };
    // spawn the next inactive object in the given pool
    api.spawn = function (pool, state, opt) {
        var obj = getInactive(pool);
        state = state || {};
        opt = opt || {};
        if (obj) {
            if (!obj.active) {
                obj.active = true;
                pool.spawn.call(pool, obj, pool, state, opt);
                return obj;
            }
        }
        return false;
    };
    // spawn all objects
    api.spawnAll = function(pool, state, opt){
        pool.objects.forEach(function(obj){
            if (!obj.active) {
                obj.active = true;
                pool.spawn.call(pool, obj, pool, state, opt);
                return obj;
            }
        });
        return pool.objects;
    };
    // purge an object ( make it inactive and call the purge method for the pool )
    api.purge = function(pool, obj, state){
        obj.active = false;
        pool.purge.call(pool, obj, pool, state);
    };
    // update a pool object by a secs value
    api.update = function (pool, secs, state) {
        var i = pool.objects.length,
        obj;
        state = state || {}; // your projects state object
        secs = secs > pool.secsCap ? pool.secsCap : secs;
        while (i--) {
            obj = pool.objects[i];
            if (obj.active) {
                pool.update.call(pool, obj, pool, state, secs);
                // if disableLifespan featre
                if(pool.disableLifespan){
                }else{
                    // else use lifespan feature
                    obj.lifespan -= secs;
                    obj.lifespan = obj.lifespan < 0 ? 0 : obj.lifespan;
                    if (obj.lifespan === 0) {
                        obj.active = false;
                        //pool.purge.call(pool, obj, pool, state);
                        api.purge.call(pool, pool, obj, state);
                    }
                }
            }
        }
    };
    // set all to inActive or active state
    api.setActiveStateForAll = function (pool, bool) {
        bool = bool === undefined ? false : bool;
        var i = pool.objects.length,
        obj;
        while (i--) {
            obj = pool.objects[i];
            obj.active = bool;
        }
    };
    // move the given object by its current heading and pps
    api.moveByPPS = function (obj, secs) {
        obj.x += Math.cos(obj.heading) * obj.pps * secs;
        obj.y += Math.sin(obj.heading) * obj.pps * secs;
    };
    // check bounds for the given display object and canvas and return true if the object
    // is out of bounds and false if it is not.
    api.checkBounds = function (obj, canvas) {
        if (obj.x >= canvas.width || obj.x < obj.w * -1 || obj.y > canvas.height || obj.y < obj.h * -1) {
            return false;
        }
        return true;
    };
    // bounding box
    api.boundingBox = function (a, b) {
        return utils.boundingBox(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h);
    };
    // wrap an object to an area like a canvas
    api.wrap = function(obj, area, space){
        area = area || {x: 0, y: 0, width: 640, height: 480 };
        space = space === undefined ? 32 : space;
        if(!utils.boundingBox(obj.x, obj.y, obj.w, obj.h, space * -1, space * -1, area.width + space, area.height + space)){
            obj.x = utils.mod(obj.x + space, area.width + space * 2) - space;
            obj.y = utils.mod(obj.y + space, area.height + space * 2) - space;
        }
    };
    // get a collection of overlaying active objects from a pool, that overlap with the gievn object
    api.getOverlaping = function(obj, pool){
        var i = 0,
        obj2,
        overlap = [];
        len = pool.objects.length;
        if(obj.active){
            while(i < len){
                obj2 = pool.objects[i];
                if(obj != obj2 && obj2.active){
                    if(utils.boundingBox(obj.x, obj.y, obj.w, obj.h, obj2.x, obj2.y, obj2.w, obj2.h)){
                         overlap.push(obj2);
                    }
                }
                i += 1;
            }
        }
        return overlap;
    };
    // get a current active count for a pool
    api.getActiveCount = function(pool){
        return pool.objects.reduce(function(acc, obj){
            return obj.active ? acc += 1: acc;
        }, 0);
    };
    // get active objects from a pool
    api.getActiveObjects = function(pool){
        return pool.objects.reduce(function(acc, obj){
            if(obj.active){
                acc.push(obj);
            }
            return acc;
        }, []);
    };
    // return public method
    return api;
}
    ());

try{
    // append to Clucker global if there, else stand alone as utils global
    if(Clucker){
        Clucker.poolMod = poolMod;
    }
}catch(e){}

}(this['Clucker'] = {}));