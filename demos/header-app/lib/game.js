
(function(gameMod){

    var SHIP_SPEEDS = [64, 96, 128],
    SHIP_COUNT = 20,
    SHIP_SPAWN_RATE = 0.05; // spawn rate in secs

    // create ships object pool helper
    var createShips = function(){
        return Clucker.poolMod.create({
            count: SHIP_COUNT,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var game = sm.game;
                // start at center
                obj.x = game.cx - obj.w / 2;
                obj.y = game.cy - obj.h / 2;
                obj.pps = SHIP_SPEEDS[Math.floor(Math.random() * SHIP_SPEEDS.length)];
                obj.heading = Math.PI / 180 * Math.round(360 * Math.random());
            },
            update: function (obj, pool, sm, secs){
                var canvas = sm.layers[0].canvas;
                // move and wrap
                Clucker.poolMod.moveByPPS(obj, secs);
                Clucker.poolMod.wrap(obj, canvas, 32);
            }
        });
    };

    // public create game state method
    gameMod.create = function(){
        var game = {
            ships: createShips(),
            cx: 400,
            cy: 150,
            spawnSecs: 0
        };
        return game;
    };

    // public update method
    gameMod.update = function(sm, secs){
        var game = sm.game;
        // update game.pool
        Clucker.poolMod.update(game.ships, secs, sm);
        // spawn
        game.spawnSecs += secs;
        if(game.spawnSecs >= SHIP_SPAWN_RATE){
            Clucker.poolMod.spawn(game.ships, sm);
            game.spawnSecs = 0;
        }
    };

    // user clicked
    gameMod.clickAt = function(sm, pos){
        //console.log(pos);
        var clickObj = {w:1, h:1, x: pos.x, y: pos.y, active: true};
        var hit = Clucker.poolMod.getOverlaping(clickObj, sm.game.ships);
        hit.forEach(function(ship){
            Clucker.poolMod.purge(sm.game.ships, ship, sm);
        });
    };

}(this['gameMod'] = {}));