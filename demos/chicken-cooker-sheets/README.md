# chicken-cooker-sheets

As of clucker 0.5.9 changes have been made to the canvas module that allow for setting an array of index values for images in the image array of a canvas layer stack created with canvasMod.createStack, rather than having a single image reference. Changes have also been made to the pool-sprite draw method in the object pool canvas plugin to make use of this new system. The changes have been made so that it does not result in code braking changes for the demos thus far at this point at least. However I still want to make at least one demo that makes use of this feature that allows for more than one image to be used with sprite sheet. Also while working on this demo I made additional changes that will be part of 0.5.10+ of clucker.

## So the main focus is using more than one image per sprite sheet object

The main thing about this demo is to give an array of image index values for a sprite sheet. As of this writing it is something that I am doing for the 'chick-walk', and 'chick-rest' sprite sheet objects.

```js
canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [2, 4], size, size);
canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [3, 5], size, size);
```

The end result can be allowing for more than one type of chicken, and/or having a whole lot of different sheets for the same chicken for the sake of having a wealth of animations for a single chicken.

## new features added to clucker

While I was working on this demo I found a lot of things that are missing in the framework that I think should be added. Also I ran into a bug or two of course that needed to be fixed.

## Changes made to sprite sheet objects

Additional changes needed to be made to the create sprite sheet method of the canvas module. In older versions of the sprite sheet object I had a single image reference as part of the sprite sheet object. For the new system I thought it might be better to just leave the image references in the image array of a canvas stack object, and then just store one or more index values for that array as an array in the sprite sheet object. This will then allow for me to set more than one index value in the images stack object for a sprite sheet, I can then just use an index value of the data property of a display object as a way to set what image index to use in this array of index values for images in the stack.

```js
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
```

## added a get active objects poolMod method

I added a new method to the object pool that will return an array of active display objects from a given object pool.

## fixed a bug in the loader of gameframe.js

My state machine called game frame in the lib folder still needs a far about of work. While working on this demo I found and patched a bug with the loader for 0.5.14 of clucker. There is still a great deal more that I will want to change with the built in loader, as well as the library and framework over all. However for now it would seem that I have worked out a bug that was the result of checking the length of the images array, rather than the count of elements that are not undefined.

```js
var loaded = sm.layers.images.reduce(function (acc, el) {
    return el === undefined ? acc : acc + 1;
}, 0);
if (loaded === sm.loader.images.count) {
    gameFrame.smSetState(sm, sm.loader.startState || 'game');
}
```


## Other features added to the 'chicken-cooker-*' line of demos

In this demo I also aim to make a number of additional improvements over the basic chicken-cooker demo that this is based off of. As I make these kinds of changes I will se about adding them here.

### Cooked Per Minute Count

One major new feature that I am pretty sure I am going to want to have for this, and any additional demos based of of this is a kind of speed counter with cooked chickens. That is something like the speedometer of a car, only we are talking cooked Chickens Per Minute \(CPM\) rather than MPH or KMPH. So in this demo I worked out some helpers, and additional changes to the game object to allow for this feature.

```js
    // CPM (Cooked Per Minute) call each time a cooked chicken is purged
    var CPMCount = function(game, deltaCount){
        var cpm = game.cpm;
        var index = cpm.counts.length - 1;
        index = index < 0 ? 0 : index;
        var count = cpm.counts[index] === undefined ? 0 : cpm.counts[index];
        count += deltaCount;
        cpm.counts[index] = count;
    };

    // CPM (Cooked Per Minute)  update method to be called over time
    var CPMupdate = function(game, secs){
        var cpm = game.cpm,
        len = cpm.counts.length,
        dSecs = 5, // the sample duration time length in secs
        maxSamples = 12; // max counts for dSecs amounts
        cpm.avg = cpm.counts.reduce(function(acc, n){
            return acc + n;
        }, 0);
        // update cpm.avg
        cpm.avg = (cpm.avg * (60 / dSecs)) / len;
        // look out for NaN
        if(len === 0){
            cpm.avg = 0;
        }
        // format the number
        cpm.avg = Number(cpm.avg.toFixed(2));
        // add secs to cpm.secs
        cpm.secs += secs;
        if(cpm.secs >= dSecs){
            cpm.counts.push(0);
            cpm.secs = utils.mod(cpm.secs, dSecs);
        }
        // shift out old counts
        if(len >= maxSamples){
            cpm.counts.shift();
        }
    };
```

This cpm.avg value can then be used to adjust things when it comes to spawning of chickens.

### Setting current max active spawn value by CPM

So yes I am using the CPM value as a way to set the current max active number of chickens

```js
    // set current max active helper
    var maxActiveUpdate = function(game){
        var spawn = game.spawn,
        cpm = game.cpm,
        avgCPM = cpm.avg > 200 ? 200 : cpm.avg,
        per = avgCPM / 200,
        deltaActive = Math.round((spawn.maxActive - spawn.minActive) * per);
        spawn.currentMaxActive = spawn.minActive + deltaActive;
    };
```

### The 'out' chicken state

Have a new chicken state that happens when the current max active spawn value goes back down. The purpose for this state is to just have t chickens that are over the active max to leave the canvas. Once they leave the canvas they get purged. 

```js
    // chicken is heading out
    chickenState.out = function(obj, pool, sm, secs){
        obj.data.sheetKey = 'chick-walk';
        obj.data.image = sm.layers.images[0];
        if(obj.data.cellDir === 0){
            obj.x += obj.pps * secs;
        }else{
            obj.x -= obj.pps * secs;
        }
        // update cells
        updateWalkCells(obj, secs);
        // purge if out
        if(obj.x < 0 || obj.x > 620){
            poolMod.purge(pool, obj, sm);
        }
        
    };   
```

### Update walk cells helper

```
    // update walk cells helper
    var updateWalkCells = function(obj, secs){
        obj.data.imgSecs += secs;
        if(obj.data.imgSecs >= 1 / 12){
            obj.data.imgSecs = 0;
            if(obj.data.cellDir === 0){
                obj.data.cellIndex = obj.data.cellIndex === 0 ? 1 : 0;
            }else{
                obj.data.cellIndex = obj.data.cellIndex === 2 ? 3 : 2;
            }
        }
    };
```

### spawn bar

Another feature of the chicken-cooker-sheets demo is the spawn bar. Outside of types of chickens, many of the additional changes seems to centered around getting spawning just right for a kind of simple always going type kind of game for now.

```js
        // spawn bar
        var w = 300;
        var x = canvas.width / 2 - w / 2;
        var per1 = 0,
        per2,
        per3;
        // main spawn bar
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, 10, w, 25);
        per1 = sm.game.spawn.currentMaxActive / sm.game.spawn.maxActive;
        per2 = per1 / sm.game.spawn.currentMaxActive * sm.game.spawn.activeCount;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, 10, w * per1, 25);
        ctx.fillStyle = 'lime';
        ctx.fillRect(x, 10, w * per2, 25);
        per3 = sm.game.spawn.secs / sm.game.spawn.rate;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, 35, w * per3, 5);
```

### Many changes to the update method of the game module

A lot of changes needed to me made with the main update method of the game module

```js
    api.update = function (game, sm, secs) {
        // SPAWN
        // get and update sm.activeCount
        var activeCount = game.spawn.activeCount = poolMod.getActiveCount(game.chickens);
        // adjust spawn rate
        var per = game.spawn.currentMaxActive / sm.CHICKENS_COUNT;
        per = per > 1 ? 1 : per;
        game.spawn.rate = sm.CHICKENS_SPAWN_RATE_SLOWEST - (sm.CHICKENS_SPAWN_RATE_SLOWEST - sm.CHICKENS_SPAWN_RATE_FASTEST) * per;
        // spawn or not
        if (activeCount >= game.spawn.currentMaxActive) {
            game.spawn.secs = 0;
            // if we are above current active
            if (activeCount > game.spawn.currentMaxActive) {
                var chicks_active = poolMod.getActiveObjects(sm.game.chickens);
                // get all chickens that are active and in 'live' or 'rest' state
                var chicks_liveRest = chicks_active.filter(function (chk) {
                        return chk.data.state === 'live' || chk.data.state === 'rest'
                    });
                var toOutCount = chicks_liveRest.length - game.spawn.currentMaxActive;
                if (toOutCount > 0) {
                    var i = 0;
                    while (i < toOutCount) {
                        chicks_liveRest[i].data.state = 'out';
                        i += 1;
                    }
                }
            }
        } else {
            // we are below the current max active count, so spawn
            game.spawn.secs += secs;
            if (game.spawn.secs >= game.spawn.rate) {
                game.spawn.secs = 0;
                poolMod.spawn(game.chickens, sm, {});
            }
        }
        // update chicken and blast pools
        poolMod.update(game.chickens, secs, sm);
        poolMod.update(game.blasts, secs, sm);
        // update Cooked Per Minute
        CPMupdate(game, secs);
        // update max active
        maxActiveUpdate(game);
    };
```

