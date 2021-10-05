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
};var poolMod = (function () {
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
    // append to Clucker global if there
    if(Clucker){
        Clucker.poolMod = poolMod;
    }
}catch(e){}

(function (api) {

    var FEATURES = {};

/********* ********** *********
 Draw Methods
********** ********** *********/

    var drawMethods = FEATURES.drawMethods = {};

    // clear a layer
    drawMethods.clear = function(stack, ctx, canvas, layerObj){
        ctx.clearRect(-2, -2, canvas.width + 2, canvas.height + 2);
    };

    // draw a background
    drawMethods.background = function (stack, ctx, canvas, layerObj, background) {
        var bg = background || stack.background || 'black';
        // if string assume it is a solid color
        if(typeof bg === 'string'){
            ctx.fillStyle = bg;
            ctx.fillRect(-2, -2, canvas.width + 2, canvas.height + 2);
        }
        // if object assume image
        if(typeof bg === 'object'){
            ctx.drawImage(bg, -1, -1, canvas.width + 2, canvas.height + 2);
        }
    };

    // built in print method
    drawMethods.print = function(stack, ctx, canvas, layerObj, text, x, y, opt){
        opt = opt || {};
        opt.fontSize = opt.fontSize || 10;
        ctx.fillStyle = opt.fillStyle || 'black';
        ctx.textBaseline = opt.baseLine || 'top';
        ctx.textAlign = opt.align || 'left';
        ctx.font = opt.fontSize + 'px arial';
        ctx.fillText(text, x, y);    
    };

    // built in draw cell method to be used with a sprite sheet object
    drawMethods.cell = function(stack, ctx, canvas, layerObj, sheetKey, cellIndex, disp){
        var spriteSheet = stack.spriteSheets[sheetKey],
        cellInfo = spriteSheet.cells[cellIndex];
        // draw the cell
        ctx.drawImage(spriteSheet.image, cellInfo.x, cellInfo.y, cellInfo.w, cellInfo.h, disp.x, disp.y, disp.w, disp.h);
    };

    // draw a points collection
    drawMethods.points = function (stack, ctx, canvas, layerObj, points, cx, cy, opt) {
        opt = opt || {};
        ctx.save();
        ctx.translate(cx, cy);
        points.forEach(function (pointArray) {
            var len = pointArray.length,
            close = opt.close === undefined ? true : opt.close,
            fill = opt.fill === undefined ? 'black' : opt.fill,
            stroke = opt.stroke === undefined ? 'white' : opt.stroke,
            lineWidth = opt.lineWidth === undefined ? 3 : opt.lineWidth,
            el,
            i = 2;
            ctx.beginPath();
            ctx.moveTo(pointArray[0], pointArray[1]);
            while (i < len) {
                el = pointArray[i];
                if (typeof el === 'number') {
                    ctx.lineTo(el, pointArray[i + 1]);
                    i += 2;
                } else {
                    var parts = el.split(':');
                    if (parts[0] === 'close') {
                        close = parts[1] === 'true' ? true : false;
                    }
                    if (parts[0] === 'stroke') {
                        stroke = parts[1] || false;
                    }
                    if (parts[0] === 'fill') {
                        fill = parts[1] || false;
                    }
                    if (parts[0] === 'lineWidth') {
                        lineWidth = parts[1] || 1;
                    }
                    i += 1;
                }
            }
            ctx.lineWidth = lineWidth;
            if (close) {
                ctx.closePath();
            }
            if (fill) {
                ctx.fillStyle = fill;
                ctx.fill();
            }
            if (stroke) {
                ctx.strokeStyle = stroke;
                ctx.stroke();
            }
        });
        ctx.restore();
    };

/********* ********** *********
 Points Methods
********** ********** *********/

    var pointsMethods = FEATURES.pointsMethods = {};

    // create a box
    pointsMethods.box = function(stack, sx, sy, w, h){
        var x = sx - w / 4,
        y = sy - h / 4;
        var points = [[
            x, y, x + w / 2, y,
            x + w / 2, y + h / 2, x, y + h / 2
        ]];
        return points;
    };

/********* ********** *********
 HELPERS
********** ********** *********/

    // get a canvas relative position that is adjusted for scale
    var getCanvasRelative = function (e) {
        var canvas = e.target,
        bx = canvas.getBoundingClientRect(),
        pos = {
            x: (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - bx.left,
            y: (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - bx.top,
            bx: bx
        };
        // adjust for native canvas matrix size
        pos.x = Math.floor((pos.x / canvas.scrollWidth) * canvas.width);
        pos.y = Math.floor((pos.y / canvas.scrollHeight) * canvas.height);
        return pos;
    };
    // create and return a canvas pointer event handler for a stack
    var canvasPointerEventHandler = function (stack, state, events) {
        return function (e) {
            var pos = getCanvasRelative(e),
            handler = null;
            e.preventDefault();
            if (e.type === 'mousedown' || e.type === 'touchstart') {
                handler = events['pointerStart'];
            }
            if (e.type === 'mousemove' || e.type === 'touchmove') {
                handler = events['pointerMove'];
            }
            if (e.type === 'mouseup' || e.type === 'touchend') {
                handler = events['pointerEnd'];
            }
            if (handler) {
                handler.call(state, e, pos, state, stack);
            }
        };
    };
    // attach canvas pointer events
    var attachCanvasPointerEvents = function (stack) {
        var handler = canvasPointerEventHandler(stack, stack.state, stack.events),
        canvas = stack[stack.length - 1].canvas,
        options = {
            passive: false
        }
        canvas.addEventListener('mousedown', handler, options);
        canvas.addEventListener('mousemove', handler, options);
        canvas.addEventListener('mouseup', handler, options);
        canvas.addEventListener('touchstart', handler, options);
        canvas.addEventListener('touchmove', handler, options);
        canvas.addEventListener('touchend', handler, options);
    };
    // create a single layer object
    var createLayer = function (opt) {
        opt = opt || {};
        opt.append = opt.append === undefined ? true : opt.append;
        var layer = {};
        // a layer should have a container
        layer.container = opt.container || document.getElementById('canvas-app') || document.body;
        if (typeof layer.container === 'string') {
            layer.container = document.querySelector(layer.container);
        }
        layer.canvas = document.createElement('canvas');
        layer.ctx = layer.canvas.getContext('2d');
        // assign the 'canvas_layer' className
        layer.canvas.className = 'canvas_layer';
        // set native width
        layer.canvas.width = opt.width === undefined ? 320 : opt.width;
        layer.canvas.height = opt.height === undefined ? 240 : opt.height;
        // translate by 0.5, 0.5
        layer.ctx.translate(0.5, 0.5);
        // disable default action for onselectstart
        layer.canvas.onselectstart = function () {
            return false;
        }
        // append canvas to container
        if (opt.append) {
            layer.container.appendChild(layer.canvas);
        }
        return layer;
    };

/********* ********** *********
 PUBLIC API
********** ********** *********/

    // create a stack of layers as an 'Array Like' Object
    api.createLayerStack = function (opt) {
        opt = opt || {};
        // creating an array like object
        var stack = {
            length: opt.length === undefined ? 2 : opt.length,
            container: opt.container || document.getElementById('canvas-app') || document.body,
            events: opt.events || {},
            state: opt.state || {},
            background: opt.background || 'blue',
            images: [], // images array for now this is loaded with images using fatures outside of canvasMod
            spriteSheets: {} // sprite sheets objects for images
        };
        if (typeof stack.container === 'string') {
            stack.container = document.querySelector(stack.container);
        }
        // layer options
        var layerOpt = {
            container: stack.container,
            append: true,
            width: opt.width || 320,
            height: opt.height || 240
        };
        // create layers for the stack
        var i = 0;
        while (i < stack.length) {
            stack[i] = createLayer(layerOpt);
            stack[i].i = i;
            i += 1;
        }
        attachCanvasPointerEvents(stack);
        return stack;
    };
    // main draw method
    api.draw = function (stack, key, layerIndex) {
        // layer object
        var layerObj = stack[layerIndex];
        // CORE ARGUMENTS created from stack, and layerIndex arguments of canvasMod.draw
        var coreArgu = [stack, layerObj.ctx, layerObj.canvas, layerObj];
        // ADDITIONAL ARGUMNETS that will change depending on the draw method used with key argument of canvasMod.draw
        var addArgu = [];
        if (arguments.length > 3) {
            addArgu = Array.prototype.slice.call(arguments, 3, arguments.length);
        }
        FEATURES.drawMethods[key].apply(stack, coreArgu.concat(addArgu));
    };
    // create points
    api.createPoints = function (stack, key) {
        var coreArgu = [stack]; 
        var addArgu = Array.prototype.slice.call(arguments, 2, arguments.length);
        var points = pointsMethods[key].apply(stack, coreArgu.concat(addArgu));
        return points;
    };
    // load additional FEATURES
    api.load = function(plugObj){
         Object.keys(plugObj).forEach(function(featuresKey){
             var featureArray = plugObj[featuresKey];
             featureArray.forEach(function(feature){
                 FEATURES[featuresKey][feature.name] = feature.method;
             })   
         });
    };
    // create and append a sprite sheet object for a stack with 
    // the given sheetKey, and imageIndices in stack.images. A cellIndex
    // is an array of cellInfo objects, or a function that will 
    // produce such an array
    api.createSpriteSheet = function(stack, sheetKey, imageIndices, cellIndex){
        var spriteSheet = {
            name: sheetKey,
            //image: null, //stack.images[imageIndices], // old image ref
            imageIndices: null,
            cells : []
        };
        // if imageIndices is a number
        if(typeof imageIndices=== 'number'){
            spriteSheet.imageIndices = [];
            spriteSheet.imageIndices.push(imageIndices);
        }
        if(typeof imageIndices=== 'object'){
            spriteSheet.imageIndices = imageIndices;
        }
        // if type is object, assume it is an array of cell objects
        // just ref the object for now.
        if(typeof cellIndex === 'object'){
           spriteSheet.cells = cellIndex;
        }
        // if the given type is a function, assume the return value is the
        // array of objects that is needed
        if(typeof cellIndex === 'function'){
           spriteSheet.cells = cellIndex.call(stack, spriteSheet.imageIndices, spriteSheet, stack);
        }
        stack.spriteSheets[sheetKey] = spriteSheet;
    };
    // built in method to help create a sprite sheet object in the typical grid layout
    api.createSpriteSheetGrid = function(stack, sheetKey, imageIndices, cellWidth, cellHeight){
        cellWidth = cellWidth === undefined ? 32: cellWidth;
        cellHeight = cellHeight === undefined ? 32: cellHeight;
        api.createSpriteSheet(stack, sheetKey, imageIndices, function(imageIndices, spriteSheet, stack){
            var image = stack.images[imageIndices[0]];
            var cw = Math.floor(image.width / cellWidth),
            ch = Math.floor(image.height / cellHeight),
            cellCount = cw * ch,
            cellIndex = 0,
            cx, 
            cy,
            cells = [];
            while( cellIndex < cellCount ){
                cx = cellIndex % cw;
                cy = Math.floor(cellIndex / cw);
                cells.push({ x: cellWidth * cx, y: cellHeight * cy, w: cellWidth, h: cellHeight });
                cellIndex += 1;
            }
            return cells;
        });
    };

}(this['Clucker'] === undefined ? this['canvasMod'] = {} : Clucker['canvasMod'] = {}));

// create canvas local if needed when not using as stand alone lib
try{
    if(Clucker){
        var canvasMod = Clucker.canvasMod;
    }
}catch(e){
}
canvasMod.load({
    // points methods to add
    pointsMethods : [
        // a circle method
        {
            name: 'circle',
            method: function(stack, cx, cy, radius, pointCount){
                pointCount = pointCount === undefined ? 100 : pointCount;
                return canvasMod.createPoints(stack, 'oval', cx, cy, radius, radius, pointCount);
            }
        },
        // an oval method
        {
            name: 'oval',
            method: function(stack, cx, cy, radius1, radius2, pointCount){
                pointCount = pointCount === undefined ? 100 : pointCount;
                var points = [[]];
                var i = 0, x, y, radian;
                while(i < pointCount){
                    radian = Math.PI * 2 / pointCount * i;
                    x = cx + Math.cos(radian) * radius1;
                    y = cy + Math.sin(radian) * radius2;
                    points[0].push(x, y);
                    i += 1;
                }
                return points;
            }
        }
    ]
});canvasMod.load({
    drawMethods: [
        // default 'pool' draw method
        {
            name: 'pool',
            method: function (stack, ctx, canvas, layerObj, pool, opt) {
                // what the default 'pool' method should be
                canvasMod.draw(stack, 'pool-imgd', layerObj.i, pool, opt);
            }
        },
        // a clean 'pool-solid' method that will just draw a solid color background
        // any image data that may or may not be in the display object will be ignored
        {
            name: 'pool-solid',
            method: function (stack, ctx, canvas, layerObj, pool, opt) {
                opt = opt || {};
                pool.objects.forEach(function (obj) {
                    // style
                    ctx.fillStyle = opt.fillStyle || obj.data.fillStyle || 'white';
                    ctx.strokeStyle = opt.strokeStyle || obj.data.strokeStyle || 'black';
                    if (obj.active || opt.drawAll) {
                        ctx.beginPath();
                        ctx.rect(obj.x, obj.y, obj.w, obj.h);
                        ctx.fill();
                        ctx.stroke();
                    }
                });
            }
        },
        // the old 'pool-imgd' draw pool method that looks for an image ref and an 'imgD' object
        // in the options object, or the data object of a poolMod display object
        {
            name: 'pool-imgd',
            method: function (stack, ctx, canvas, layerObj, pool, opt) {
                opt = opt || {};
                pool.objects.forEach(function (obj) {
                    // image data if any
                    var image = opt.image || obj.data.image || false,
                    imgD = opt.imgD || obj.data.imgD || {};
                    // style
                    ctx.fillStyle = opt.fillStyle || obj.data.fillStyle || 'white';
                    ctx.strokeStyle = opt.strokeStyle || obj.data.strokeStyle || 'black';
                    if (obj.active || opt.drawAll) {
                        if (image) {
                            ctx.drawImage(image, imgD.x, imgD.y, imgD.w, imgD.h, obj.x, obj.y, obj.w, obj.h);
                        } else {
                            ctx.beginPath();
                            ctx.rect(obj.x, obj.y, obj.w, obj.h);
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                });
            }
        },
        // stand alone draw sprite method
        {
            name: 'sprite',
            method: function(stack, ctx, canvas, layerObj, obj, opt){
                opt = opt || {};
                // sheet key
                var sheetKey = opt.sheetKey || obj.data.sheetKey || 'default';
                // cell index
                var cellIndex = 0; // default cell index to 0
                if (obj.data.cellIndex >= 0) { // if we have a cellIndex in disp.data use that
                    cellIndex = obj.data.cellIndex;
                }
                if (opt.cellIndex >= 0) { // opt object can be used to override all others
                    cellIndex = opt.cellIndex;
                }
                // global alpha
                ctx.globalAlpha = obj.data.alpha === undefined ? 1 : obj.data.alpha;
                // get the sheet
                var sheet = stack.spriteSheets[sheetKey];
                // if we have a sheet use that
                if (sheet) {
                    if (obj.active || opt.drawAll) {
                        //var image = sheet.image;
                        var imageIndex = obj.data.imageIndex === undefined ? 0 : obj.data.imageIndex;
                        var image = stack.images[sheet.imageIndices[imageIndex]];
                        var imgD = sheet.cells[cellIndex];
                        ctx.drawImage(image, imgD.x, imgD.y, imgD.w, imgD.h, obj.x, obj.y, obj.w, obj.h);
                    }
                } else {
                    // if we fail to get a sheet use 'pool-solid'
                    canvasMod.draw(stack, 'pool-solid', layerObj.i, pool, opt);
                }
            }
        },
        // the newer 'pool-sprite method' that is designed to work with the stack.spriteSheets object
        // this method will look for a disp.data.sheetKey to know what sprite sheet to use
        // a disp.data.cellIndex will also be used to know what imgD like object in the cells array
        // of the spriteSheet object to use
        {
            name: 'pool-sprite',
            method: function (stack, ctx, canvas, layerObj, pool, opt) {
                opt = opt || {};
                // draw sprite method for each object in the pool
                pool.objects.forEach(function (obj) {
                    canvasMod.draw(stack, 'sprite', layerObj.i, obj, {});  
                });
                // make sure global alpha is set back to 1
                ctx.globalAlpha = 1;
            }
        }
    ]
});
canvasMod.load({
    drawMethods : [
        // draw a button
        {
            name: 'button',
            method: function(stack, ctx, canvas, layerObj, button){
                var textOptions = {align: 'center', baseLine: 'middle', fontSize: button.descSize || 10 }, x, y;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.rect(button.x, button.y, button.w, button.h);
                ctx.fill();
                ctx.stroke();
                if(button.minor){
                    x = button.x + button.w / 2;
                    y = button.y + button.h / 3;
                    canvasMod.draw(stack, 'print', layerObj.i, button.desc, x, y, textOptions);
                    y += button.h / 3;
                    textOptions.fontSize = button.minorSize || 10;
                    canvasMod.draw(stack, 'print', layerObj.i, button.minor, x, y, textOptions);
                }else{
                    x = button.x + button.w / 2;
                    y = button.y + button.h / 2;
                    canvasMod.draw(stack, 'print', layerObj.i, button.desc, x, y, textOptions);
                }
            }
        },
        // draw a button collection for the current state object
        {
            name: 'stateButtons',
            method: function(stack, ctx, canvas, layerObj, sm){
                var state = sm.states[sm.currentState];
                Object.keys(state.buttons).forEach(function(buttonKey){
                    var button = state.buttons[buttonKey];
                    canvasMod.draw(stack, 'button', layerObj.i, button);
                });
            }
        }
    ]
});
(function (api) {

    /********* ********** ********** ********** *********/
    //  CREATE State Machine PUBLIC Methods and helpers
    /********* ********** ********** ********** *********/

    // create a minamal sm object ( For setting up a nested sm object, and the base of a main sm object )
    api.smCreateMin = function (opt) {
        opt = opt || {};
        // return a base sm object
        var sm = {
            currentState: opt.currentState || '',
            states: opt.states || {},
            events: opt.events || {}
        };
        return sm;
    };

    // helpers for main create method
    var callStateObjectPointerEvent = function (pointerType, e, pos, sm) {
        var state = sm.states[sm.currentState],
        handler;
        if (state) {
            handler = state.events[pointerType];
            if (handler) {
                handler.call(sm, e, pos, sm);
            }
        }
    };
    // check if a button was clicked for the current state, if so call the onClick method for it
    var buttonCheck = function (e, pos, sm) {
        var state = sm.states[sm.currentState];
        var buttonKeys = Object.keys(state.buttons);
        var i = 0,
        len = buttonKeys.length,
        button;
        while (i < len) {
            button = state.buttons[buttonKeys[i]];
            if (utils.boundingBox(button.x, button.y, button.w, button.h, pos.x, pos.y, 1, 1)) {
                button.onClick.call(sm, e, pos, sm, button);
            }
            i += 1;
        }
    };

    var pushLoaderState = function (sm) {
        Clucker.gameFrame.smPushState(sm, {
            name: 'loader',
            start: function (sm) {
                canvasMod.draw(sm.layers, 'background', 0);
                // set up images array
                sm.images = [];
                var images = sm.layers.images = [];
                var loaderObj = sm.loader;
                // if we have images to load start the requests for them
                if (sm.loader.images) {
                    var i = 0;
                    while (i < sm.loader.images.count) {
                        (function (imageIndex) {
                            utils.httpPNG({
                                url: sm.loader.images.baseURL + '/' + imageIndex + '.png',
                                // set to sm images if all goes well
                                onDone: function (image, xhr) {
                                    // OLD ARRAY
                                    //sm.images[imageIndex] = image;
                                    // NEW ARRAY
                                    images[imageIndex] = image;

                                },
                                // just a blank image for now if there is an error
                                onError: function () {

                                    console.log('error')

                                    // OLD ARRAY
                                    sm.images[imageIndex] = new Image();
                                    // NEW ARRAY
                                    images[imageIndex] = new Image();
                                }
                            });
                        }
                            (i));
                        i += 1;
                    }
                }
            },
            update: function (sm, secs) {

                var loaded = sm.layers.images.reduce(function (acc, el) {
                        return el === undefined ? acc : acc + 1;
                    }, 0);
                if (loaded === sm.loader.images.count) {
                    Clucker.gameFrame.smSetState(sm, sm.loader.startState || 'game');
                }

                /*
                if(sm.loader.images){
                // start game state when all images are loaded
                //if(sm.images.length === sm.loader.images.count){
                if(sm.layers.images.length === sm.loader.images.count){
                gameFrame.smSetState(sm, sm.loader.startState || 'game');
                }
                }else{
                // no images just progress to game state
                gameFrame.smSetState(sm, sm.loader.startState ||  'game');
                }
                 */
            },
            draw: function (sm, layers) {
                var ctx = layers[1].ctx,
                canvas = layers[1].canvas,
                cx = canvas.width / 2,
                cy = canvas.height / 2;
                // clear
                canvasMod.draw(layers, 'clear', 1);
                // if images
                if (sm.loader.images) {
                    ctx.fillStyle = 'white'
                        ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.rect(0, cy - 10, canvas.width * (sm.images.length / sm.loader.images.count), 10);
                    ctx.fill();
                    ctx.stroke();
                    canvasMod.draw(layers, 'print', 1, sm.images.length + ' / ' + sm.loader.images.count, cx, cy + 15, {
                        align: 'center',
                        fontSize: 30
                    });
                }
            }
        });
    };
    // create the main sm object
    api.smCreateMain = function (opt) {
        opt = opt || {};
        // create base sm object
        var sm = api.smCreateMin(opt);
        // values that can be set by options
        sm.ver = opt.ver || '';
        sm.game = opt.game || {};
        sm.fps = opt.fps === undefined ? 30 : opt.fps;
        sm.loader = opt.loader || {};
        sm.images = [];
        // events
        sm.events = opt.events || {
            pointerStart: function (e, pos, sm) {
                buttonCheck(e, pos, sm);
                callStateObjectPointerEvent('pointerStart', e, pos, sm);
            },
            pointerMove: function (e, pos, sm) {
                callStateObjectPointerEvent('pointerMove', e, pos, sm);
            },
            pointerEnd: function (e, pos, sm) {
                callStateObjectPointerEvent('pointerEnd', e, pos, sm);
            }
        };
        // set up stack of canvas layers using the canvas module
        sm.layers = canvasMod.createLayerStack({
                length: opt.canvasLayers === undefined ? 3 : opt.canvasLayers,
                container: opt.canvasContainer || document.getElementById('canvas-app') || document.body,
                events: sm.events,
                state: sm,
                width: opt.width,
                height: opt.height
            });
        sm.debugMode = opt.debugMode || false;
        // value that should not be set by options
        sm.secs = 0;
        sm.stopLoop = false;
        sm.lt = new Date();
        // if sm.loader.images push built in loader state
        if (sm.loader.images) {
            pushLoaderState(sm);
        }
        // main loop
        sm.loop = function () {
            var now = new Date();
            sm.secs = (now - sm.lt) / 1000,
            state = sm.states[sm.currentState] || {};
            if (sm.secs >= 1 / sm.fps) {
                // update
                var update = state.update;
                if (update) {
                    update.call(sm, sm, sm.secs);
                }
                // draw
                var drawMethod = state.draw;
                if (drawMethod) {
                    drawMethod.call(sm, sm, sm.layers, canvasMod);
                }
                sm.lt = now;
            }
            // if sm.stopLoop === false, then keep looping
            if (!sm.stopLoop) {
                requestAnimationFrame(sm.loop);
            }
        };
        // stop loop on any page error
/*
        window.addEventListener('error', function (e) {
            if (sm.debugMode) {
                sm.stopLoop = true;
                console.log('error: ' + e.message);
                console.log(e);
                console.log('loop stoped');
            }
        });
*/
        return sm;
    };

    /********* ********** ********** ********** *********/
    //  PUSH NEW STATE OBJECTS
    /********* ********** ********** ********** *********/

    // push a new state object
    api.smPushState = function (sm, opt) {
        var state = {
            name: opt.name || 'state_' + Object.keys(sm.states).length
        };
        state.buttons = opt.buttons || {};
        state.start = opt.start || function () {};
        state.end = opt.end || function () {};
        state.update = opt.update || function () {};
        state.draw = opt.draw || function () {};
        state.events = opt.events || {};
        sm.states[state.name] = state;
        return state;
    };

    /********* ********** ********** ********** *********/
    //  SET THE CURRENT STATE
    /********* ********** ********** ********** *********/

    // set the current state
    api.smSetState = function (sm, newState) {
        // get a ref to the old state
        var oldState = sm.states[sm.currentState];
        // call the on end hook for the old state if it has one
        if (oldState) {
            var endHook = oldState.end;
            if (endHook) {
                endHook.call(sm, sm);
            }
        }
        // change to the new state, and call the start hook it it has one
        sm.currentState = newState;
        var newState = sm.states[sm.currentState];
        var startHook = newState.start;
        if (startHook) {
            startHook.call(sm, sm, canvasMod);
        }
    };
}(this['Clucker'] === undefined ? this['gameFrame'] = {} : Clucker['gameFrame'] = {}));

// create Clucker methods
if(this['Clucker']){
  // Clucker.createMain
  Clucker.createMain = function(opt){
      return Clucker.gameFrame.smCreateMain(opt);
  };
  // Clicker.pushState
  Clucker.pushState = function(sm, opt){
      return Clucker.gameFrame.smPushState(sm, opt);
  };
  Clucker.setState = function(sm, key){
      return Clucker.gameFrame.smSetState(sm, key);
  };
}





(function (api) {

    var createToStateButton = function (toState, x, y, desc) {
        return {
            x: x,
            y: y,
            w: 64,
            h: 64,
            desc: desc || 'Back',
            onClick: function (e, pos, sm, button) {
                Clucker.gameFrame.smSetState(sm, toState);
            }
        }
    };

    /********* ********** ********** ********** *********/
    //
    /********* ********** ********** ********** *********/

    // create and rerturn a state object
    api.createState = function (sm, opt) {
        opt = opt || {};
        opt.buttonLayer = opt.buttonLayer || 2;
        opt.upgradeStateKey = opt.upgradeStateKey || 'upgrades';
        opt.gameStateKey = opt.gameStateKey || 'game';
        opt.menuStateKey = opt.menuStateKey || 'menu';
        opt.update = opt.update || function () {};

        var canvasWidth = sm.layers[0].canvas.width,
        canvasHeight = sm.layers[0].canvas.height;

        return {
            name: opt.upgradeStateKey,
            buttons: {
                to_game: createToStateButton(opt.gameStateKey, canvasWidth - 64 - 16, 16, 'Game'), //createToGameButton(),
                back: createToStateButton(opt.menuStateKey, 16, 16, 'Back')
            },
            start: function (sm, canvasMod) {},
            update: function (sm, secs) {

                opt.update(sm, secs);

            },
            draw: function (sm, layers, canvasMod) {
                // clear
                canvasMod.draw(layers, 'clear', opt.buttonLayer);
                // buttons
                canvasMod.draw(layers, 'stateButtons', opt.buttonLayer, sm);
            }
        };
    };

}
    (this['Clucker'] === undefined ? this['upgrades'] = {}
        : Clucker['upgrades'] = {}));

}(this['Clucker'] = {ver:'0.6.1'}));