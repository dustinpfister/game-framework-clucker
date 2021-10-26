
(function(gameMod){

    var SHIP_SPEEDS = [64, 96, 128],
    SHIP_COUNT_MAX = 30,
    SHIP_SPAWN_RATE = 0.05; // spawn rate in secs

    // create ships object pool helper
    var createShips = function(opt){
        opt = opt || {};
        opt.shipCountPer = opt.shipCountPer === undefined ? 1 : opt.shipCountPer;
        return Clucker.poolMod.create({
            count: 1 + Math.round(opt.shipCountPer * (SHIP_COUNT_MAX - 1)),
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var game = sm.game;
                // start at center
                obj.x = game.cx - obj.w / 2;
                obj.y = game.cy - obj.h / 2;
                obj.pps = SHIP_SPEEDS[Math.floor(Math.random() * SHIP_SPEEDS.length)];
                obj.heading = Math.PI / 180 * Math.round(360 * Math.random());
                // sheetkey
        obj.data.cellIndex = 0;
        obj.data.sheetKey = 'ship-type-one';
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
    gameMod.create = function(opt){
        var game = {
            ships: createShips(opt),
            cx: 400,
            cy: 150,
            spawnSecs: 0
        };

console.log(game.ships.objects[0]);

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