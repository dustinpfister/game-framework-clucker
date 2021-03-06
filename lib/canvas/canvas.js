
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
        layer.canvas.className = opt.layerClassName || '';
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
            height: opt.height || 240,
            layerClassName: opt.layerClassName || 'canvas_layer'
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
