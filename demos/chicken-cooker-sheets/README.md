# chicken-cooker-sheets

As of clucker 0.5.9 changes have been made to the canvas module that allow for setting an array of index values for images in the image array of a canvas layer stack created with canvasMod.createStack, rather than having a single image reference. Changes have also been made to the pool-sprite draw method in the object pool canvas plugin to make use of this new system. The changes have been made so that it does not result in code braking changes for the demos thus far at this point at least. However I still want to make at least one demo that makes use of this feature that allows for more than one image to be used with sprite sheet. Also while working on this demo I made additional changes that will be part of 0.5.10+ of clucker.

## So the main focus is using more than one image per sprite sheet object

The main thing about this demo is to give an array of image index values for a sprite sheet. As of this writing it is soemthing that I am doing for the 'chick-walk', and 'chick-rest' sprite sheet objects.

```js
canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [2, 4], size, size);
canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [3, 5], size, size);
```

The end result can be allowing for more than one type of chicken, and/or having a whole lot of different sheets for the same chicken for the sake of having a wealth of animations for a single chicken.

## new features added to clucker

## changes made to sprite sheet objects

## added a get active objects poolMod method



## Other features added to the 'chicken-cooker-*' line of demos

In this demo I also aim to make a number of additional improvements over the basic chicken-cooker demo that this is based off of. As I make these kinds of changes I will se about adding them here.

### Cooked Per Minute Count

One major new feature that I am pretty sure I am going to want to have for this, and any additional demos based of of this is a kind of spped counter with cooked chickens. That is something like the speedomiter of a car, only we are talking cooked Chickens Per Minute \(CPM\) rather than MPH or KMPH. So in this demo I worked out some helpers, and additional changes to the game object to allow for this feature.

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

So yes I am uisng the CPM value as a way to set the current max active number of chickens

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

### Setting chickens to out state in update method

```js
    api.update = function(game, sm, secs){
        game.spawn.secs += secs;
        // spawn
        if(game.spawn.secs >= game.spawn.rate){
            game.spawn.secs = 0;
            // get active count
            var activeCount = poolMod.getActiveCount(sm.game.chickens);
            // if we are below current active
            if(activeCount < game.spawn.currentMaxActive){
                poolMod.spawn(game.chickens, sm, {});
            }
            // if we are above current active
            if(activeCount > game.spawn.currentMaxActive){
                var chicks_active = poolMod.getActiveObjects(sm.game.chickens);
                // get all chickens that are active and in 'live' or 'rest' state
                var chicks_liveRest = chicks_active.filter(function(chk){
                    return chk.data.state === 'live' || chk.data.state === 'rest'
                });
                var toOutCount = chicks_liveRest.length - game.spawn.currentMaxActive;
                if(toOutCount > 0){
                    var i = 0;
                    while(i < toOutCount){
                        chicks_liveRest[i].data.state = 'out';
                        i += 1;
                    }
                }
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

### update walk cells helper

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
