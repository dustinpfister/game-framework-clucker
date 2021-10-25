
console.log('Using clucker v' + Clucker.ver)


// create an sm object
var sm = Clucker.createMain({
    appName: 'clucker-storage-demo',
    currentState: 'game', // set starting state object to use
    width: 640,
    height: 480,
    game: {
        score: 0,
        pool: Clucker.poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var canvas = sm.layers[0].canvas;
                obj.w = 64;
                obj.h = 64;
                obj.x = canvas.width / 2 - obj.w / 2;
                obj.y = canvas.height / 2 - obj.h / 2;
                obj.heading = Math.PI * 2 * Math.random();
                obj.pps = 256;
            },
            update: function (obj, pool, sm, secs){
                Clucker.poolMod.moveByPPS(obj, secs);
                Clucker.poolMod.wrap(obj, sm.layers[0].canvas, 32);
            },
            purge: function(obj, pool, sm){
                sm.game.score += 1;
            }
        })
    }
});

Clucker.pushState(sm, {
    name: 'game',
    start: function(sm, canvasMod){
        canvasMod.draw(sm.layers, 'background', 0);
        // try to get a save state
        var save = Clucker.storage.get(sm.appName);
        if(!save){
           // if no save start a new game and save that for the first time
           sm.game.score = 0;
           Clucker.storage.set(sm.appName, { score: 0 });
        }else{
            // if we have a save load that
            sm.game.score = save.score;
        }
    },
    update: function(sm, secs){
        Clucker.poolMod.spawn(sm.game.pool, sm, {});
        Clucker.poolMod.update(sm.game.pool, secs, sm);
    },
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'pool', 1, sm.game.pool);
        canvasMod.draw(layers, 'print', 1, 'score: ' + sm.game.score, 10, 10, { fontSize: 30});
    },
    events: {
        pointerStart: function(e, pos, sm){
            var clickObj = {w:1, h:1, x: pos.x, y: pos.y, active: true};
            var hit = Clucker.poolMod.getOverlaping(clickObj, sm.game.pool);
            hit.forEach(function(ship){
                Clucker.poolMod.purge(sm.game.pool, ship, sm);
            });
            // set save state on each click
            Clucker.storage.set(sm.appName, { score: sm.game.score });
        }
    }
});

// start game with current state in sm object
Clucker.start(sm);
