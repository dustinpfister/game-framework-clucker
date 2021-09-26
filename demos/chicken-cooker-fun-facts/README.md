# chicken-cooker-fun-facts

This is yet another chicken-cooker-\* demo based off of the source code in chicken-cooker-sheets which in turn was based off of chicken-cooker. With this demo I wanted to start a system that has to do with a character appearing at the bottom of the canvas to mention some kind of fun fact about chickens, or the game. The idea is to just have a fun feature that would be nice for some kind of kiosk like project, or a tutorial system. 

So for this I am going to need to work out a few custom systems when it comes to having a sprite sheets to handle what I have in mind for animation. In additional I think I will also want to work out a quick system for using an image to work as a sprite sheet for a custom font for this collection of demos for the clucker framework.

## So the main focus is this fun fact system

The main idea here is to work out a system where a guy will slide across the screen and say something and then leave for one of several types of reasons such as a timeout, or some kind of user action. So then I will need some kind of standard when it comes to knowing when a trigger should fire and when the guy should leave.

```js
    // idle trigger
    TRIGGERS.cpm = {
        key: 'cpm',
        activeCondition: function (funFacts) {
            var game = funFacts.sm.game,
            avg_cpm = game.cpm.avg;
            if (funFacts.CPMValues === undefined || avg_cpm === 0) {
                funFacts.CPMValues = [50, 100, 200, 300];
                funFacts.bestCPM = 0;
            }
            funFacts.bestCPM = avg_cpm > funFacts.bestCPM ? avg_cpm : funFacts.bestCPM;
            if (funFacts.CPMValues.length > 0) {
                if (funFacts.bestCPM >= funFacts.CPMValues[0]) {
                    funFacts.sayIndex = 4 - funFacts.CPMValues.length;
                    funFacts.lines = wrapSay(funFacts.triggers.cpm.says[funFacts.sayIndex]);
                    funFacts.CPMValues.shift();
                    return true;
                }
            }
            return false;
        },
        leaveCondition: function (funFacts) {
            return funFacts.talkSecs >= 10;
        },
        says: [
            'You have a Chickens Per Minute speed of 50. Not Bad.',
            'Chickens Per Minute speed of 100 now. Order up!',
            'Chickens Per Minute of 200 or more now. Keep it up.',
            'You have a Chickens Per Minute speed of 300 or more now. You are one stone cold killer.'
        ],
        init: function (funFacts) {},
        done: function (funFacts) {},
        update: function (funFacts) {}
    };
```

## Changes made to clucker

While working on these demos I also found a number of things that need to change or additional features that needed to be added to clucker.js. When I stoped working on this demo as of this writing I have made the demo work with clucker 0.5.25, to which a lot of chnages happend. So with that said here are a few things that happened while working out this chicken cooker fun facts demo.

## Added a utils.wrapText method

I started a section of methods in the utils librray that will be a number of methods that have to do with text. That is creating an array of substrings from a source string that will line up with a given max width of letters.

```js
utils.wrapText = function(str, width){
    var patt = new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g');
    return str.replace(patt, '$1\n').split('\n');
};
```

## draw single sprite object method in mod-pool.js canvas plugin

When starting to work out things with sprite sheets for the fun facts demo I ran into a problem. I did not want to use an object pool for creating the various parts of the fun facts guy. However I did still want to draw single sprite cells to various locations to draw the fun facts guy. So simply put I needed to have a way to just draw a single sprite sheet cell for a single stand alone object rather than a pool of objects.

The solution for this was simple enough and I was able to do it without braking code by just pulling the logic that has to do with drawing a single sprite object into its own stand alone draw method in the mod-pool.js canvas plug-in.

```js
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
```