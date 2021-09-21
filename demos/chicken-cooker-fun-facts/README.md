# chicken-cooker-fun-facts

This is yet another chicken-cooker-\* demo based off of the souce code in chicken-cooker-sheets which in turn was based off of chicken-cooker. With this demo I wanted to start a system that has to do with a charicter appearing at the bottom of the canvas to mention some kind of fun fact about chickens, or the game. The idea is to just have a fun feature that would be nice for some kind of kiosk like project, or a tutorial system. 

So for this I am going to need to work out a few custom systems when it comes to having a spriyte sheets to handle what I have in mind for animation. In additional I think I will also want to work out a quick system for using an image to work as a sprite sheet for a custom font for this collection of demos for the clucker framework.

## So the main focus is this fun fact system



## Changes made to clucker

While working on these demos I also find a number of things that need to change or addiitonal features that needed to be added to clucker.js. So with that said here are a few things that happened while working out this chicken cooker fun facts demo.

## draw single sprite object method in mod-pool.js canvas plugin

When starting to work out things with sprite sheets for the fun facts demo I ran into a problem. I did not want to use an object pool for creating the various parts of the fun facts guy. However I did still want to draw single sprite cells to various locations to draw the fun facts guy. So simply put I needed to have a way to just draw a single sprite sheet cell for a single stand alone object rather than a pool of objects.

The solution for this was simple enough and I was able to do it without braking code by just pulling the logic that has to do with drarwing a single sprite object into its own stand alone draw method in the mod-pool.js canvas plugin.

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