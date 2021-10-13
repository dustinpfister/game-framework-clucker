
(function(gameMod){

    var SHIP_SPEEDS = [64, 96, 128],
    SHIP_SPAWN_RATE = 0.5; // spawn rate in secs

    // create ships object pool helper
    var createShips = function(){
        return Clucker.poolMod.create({
            count: 8,
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
            pool: createShips(),
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
        Clucker.poolMod.update(game.pool, secs, sm);

        // spawn
        game.spawnSecs += secs;
        if(game.spawnSecs >= SHIP_SPAWN_RATE){
            Clucker.poolMod.spawn(game.pool, sm);
            game.spawnSecs = 0;
        }
    };

    // user clicked
    gameMod.clickAt = function(sm, pos){
        console.log(pos);
    };

}(this['gameMod'] = {}));