
(function(gameMod){

    var SHIP_SPEEDS = [32, 64, 128],
    SHIP_COUNT_MAX = 30,
    SHIP_HP_MIN = 1,
    SHIP_HP_MAX = 10,
    SHIP_MONEY_MIN = 1,                    // min and max money values for ships
    SHIP_MONEY_MAX = 1000,
    SHIP_SPAWN_DIST_FROM_CENTER = 200,
    SHIP_SPAWN_RATE = 1.25,                // spawn rate in secs
    UNIT_COUNT_MAX = 3,                    // MAX UNIT POOL SIZE (1 to 40)
    SHOTS_COUNT_MAX = 50;

/********* ********** **********
  SHIPS
********** ********** *********/

    // set ship dir
    var shipSetDir = function(ship, dir){
        dir = Clucker.utils.mod(dir, 8);
        ship.data.dir = dir;
        ship.data.cellIndex = ship.data.dir;
        ship.heading =  (Math.PI * 2) / 8 * ship.data.dir;
    };
    // update ship dir
    var shipDirUpdate = function(ship, secs){
        var dd = ship.data.dirDelta;
        if(dd.count > 0){
           dd.secs += secs;
           if(dd.secs >= dd.rate){
              dd.secs = 0;
              dd.count -= 1;
              ship.data.dir += dd.sign;
              shipSetDir(ship, ship.data.dir);
           }
        }else{
           dd.secs = 0;
        }
    };
    // create ship dirDelta object
    var shipDirDelta = function(count, rate, sign){
        return {
            count: Math.floor(count) || 0, // count of times left
            rate: rate === undefined ? 1 : rate,
            secs: 0,
            sign: sign === undefined ? 1 : sign   // sign 1 or -1
        };
    };

    // create ships object pool helper
    var createShips = function(opt){
        opt = opt || {};
        opt.shipCountPer = opt.shipCountPer === undefined ? 1 : opt.shipCountPer;
        opt.shipHPPer = opt.shipHPPer === undefined ? 1 : opt.shipHPPer;
        opt.shipMoneyPer = opt.shipMoneyPer === undefined ? 1 : opt.shipMoneyPer;
        return Clucker.poolMod.create({
            count: 1 + Math.round(opt.shipCountPer * (SHIP_COUNT_MAX - 1)),
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var game = sm.game;
                // dir
                obj.data.dir = 0;
                obj.data.dirDelta = shipDirDelta();
                // stats
                var stat = obj.stat = {};
                stat.hpMax = SHIP_HP_MIN + Math.round( (SHIP_HP_MAX - SHIP_HP_MIN) * opt.shipHPPer );
                stat.hp = stat.hpMax;
                stat.money = SHIP_MONEY_MIN + Math.round( (SHIP_MONEY_MAX - SHIP_MONEY_MIN) * opt.shipMoneyPer )
                // sheetkey
                obj.data.cellIndex = 0;
                obj.data.sheetKey = 'ship-type-one';
                // start dir
                shipSetDir(obj, Math.floor(Math.random() * 8));
                // start out of bounds
                var dist = SHIP_SPAWN_DIST_FROM_CENTER;
                obj.x = game.cx - dist + Math.round(dist * 2 * Math.random());
                obj.y = obj.h * -1;
                // speed and heading
                obj.pps = SHIP_SPEEDS[Math.floor(Math.random() * SHIP_SPEEDS.length)];
                obj.heading =  (Math.PI * 2) / 8 * obj.data.dir;
            },
            update: function (obj, pool, sm, secs){
                var canvas = sm.layers[0].canvas;
                // move and wrap
                Clucker.poolMod.moveByPPS(obj, secs);
                Clucker.poolMod.wrap(obj, canvas, 32);
                // dir change
                var roll = Math.random();
                if(roll < 0.025 && obj.data.dirDelta.count === 0){
                    var count = 1 + Math.round( Math.random() * 4);
                    var rate = 1;
                    var sign = Math.random() >= 0.5 ? -1 : 1;
                    obj.data.dirDelta = shipDirDelta(count, rate, sign);
                }
                shipDirUpdate(obj, secs);
            }
        });
    };

/********* ********** **********
  SHOTS
********** ********** *********/

    // create shots object pool helper
    var createShots = function(opt){
        opt = opt || {};
        return Clucker.poolMod.create({
            count: SHOTS_COUNT_MAX,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm, opt){
                obj.data.fillStyle = 'rgba(64,64,64,0.7)';
                // stats
                var stat = obj.stat = {};
                // sheetkey
                //obj.data.cellIndex = 0;
                //obj.data.sheetKey = 'ship-type-one';
                // start pos
                obj.x = opt.x || 0;
                obj.y = opt.y || 0;
                obj.w = 10;
                obj.h = 10;
            },
            update: function (obj, pool, sm, secs){

            }
        });
    };


/********* ********** **********
  UNITS
********** ********** *********/

    // get current unit pool positions where a unit can be placed
    var getUnitPositions = function(units){
        var cellX = 0, cellY = 0, x, y,
        positions = [];
        while(cellY <= 3){
            y = 50 + 50 * cellY;
            cellX = 0;
            while(cellX <= 9){
                x = 150 + 50 * cellX;
                positions.push({x: x, y: y});
                cellX += 1;
            }
            cellY += 1;
        }
        return positions.filter(function(pos){
            var i = units.objects.length, obj;
            while(i--){
                obj = units.objects[i];
                if(Clucker.utils.boundingBox(pos.x+ 5, pos.y+ 5, 40, 40, obj.x, obj.y, obj.w, obj.h)){
                    return false;
                }
            }
            return true;
        });
    };

    // create units object pool helper
    var createUnits = function(opt){
        opt = opt || {};
        return Clucker.poolMod.create({
            count: UNIT_COUNT_MAX,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                obj.data.fillStyle = 'rgba(0,255,128,0.5)';
                // stats
                var stat = obj.stat = {};
                // sheetkey
                //obj.data.cellIndex = 0;
                //obj.data.sheetKey = 'ship-type-one';
                // start pos
                var positions = getUnitPositions(pool);
                var pos = positions[Math.floor(positions.length * Math.random())];
                obj.x = pos.x; obj.y = pos.y; obj.w = 50; obj.h = 50;
            },
            update: function (obj, pool, sm, secs){

                Clucker.poolMod.spawn(sm.game.shots, sm, {
                    x: obj.x + obj.w / 2 - 5,
                    y: obj.y + obj.h / 2 - 5,
                    a: Math.PI * 2 * Math.random()
                });

            }
        });
    };

/********* ********** **********
  PUBLIC METHODS
********** ********** *********/

    // public create game state method
    gameMod.create = function(opt){
        var game = {
            money: opt.money || 0,
            ships: createShips(opt),
            units: createUnits(opt),
            shots: createShots(opt),
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
        Clucker.poolMod.update(game.units, secs, sm);
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
            var stat = ship.stat;
            stat.hp -= 1;
            stat.hp = stat.hp < 0 ? 0 : stat.hp;
            if(stat.hp === 0){
                sm.game.money += stat.money;
                Clucker.poolMod.purge(sm.game.ships, ship, sm);
            }
        });
    };

}(this['gameMod'] = {}));