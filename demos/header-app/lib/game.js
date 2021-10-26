
(function(gameMod){

    var SHIP_SPEEDS = [16, 24, 32, 64, 96],
    SHIP_COUNT_MAX = 30,
    SHIP_SPAWN_RATE = 1.25; // spawn rate in secs

    // set ship dir
    var setShipDir = function(ship, dir){
        dir = Clucker.utils.mod(dir, 8);
        ship.data.dir = dir;
        ship.data.cellIndex = ship.data.dir;
        ship.heading =  (Math.PI * 2) / 8 * ship.data.dir;
    };

    var shipDirUpdate = function(ship, secs){
        var dd = ship.data.dirDelta;
        if(dd.count > 0){
           dd.secs += secs;
           if(dd.secs >= dd.rate){
              dd.secs = 0;
              dd.count -= 1;
              ship.data.dir += dd.sign;
              setShipDir(ship, ship.data.dir);
           }
        }else{
           dd.secs = 0;
        }
    };

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
                // dir
                obj.data.dir = 0;
                obj.data.dirDelta = {
                    count: 5, // count of times left
                    rate: 1,
                    secs: 0,
                    sign: -1   // sign 1 or -1
                };
                // sheetkey
                obj.data.cellIndex = 0;
                obj.data.sheetKey = 'ship-type-one';
                // start dir
                setShipDir(obj, Math.floor(Math.random() * 8));
                // start at center
                obj.x = game.cx - obj.w / 2;
                obj.y = game.cy - obj.h / 2;
                obj.pps = SHIP_SPEEDS[Math.floor(Math.random() * SHIP_SPEEDS.length)];
                obj.heading =  (Math.PI * 2) / 8 * obj.data.dir;
            },
            update: function (obj, pool, sm, secs){
                var canvas = sm.layers[0].canvas;
                // move and wrap
                Clucker.poolMod.moveByPPS(obj, secs);
                Clucker.poolMod.wrap(obj, canvas, 32);

                //obj.data.dir += 1;
                //setShipDir(obj, obj.data.dir);
                shipDirUpdate(obj, secs);

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