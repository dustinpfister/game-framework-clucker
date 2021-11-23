(function(shipsMod){

/********* ********** **********
  HELPERS
********** ********** *********/

    var rangeByPer = Clucker.utils.valueByRange;


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
    shipsMod.createShips = function(opt){
        opt = opt || {};
        // ships pool options
        opt.quality = opt.quality === undefined ? 0 : opt.quality;
        opt.SHIP_COUNT_MIN = opt.SHIP_COUNT_MIN === undefined ? 1 : opt.SHIP_COUNT_MIN;
        opt.SHIP_COUNT_MAX = opt.SHIP_COUNT_MAX === undefined ? 5 : opt.SHIP_COUNT_MAX;
        opt.SHIP_HP_MIN = opt.SHIP_HP_MIN === undefined ? 1 : opt.SHIP_HP_MIN;
        opt.SHIP_HP_MAX = opt.SHIP_HP_MAX === undefined ? 5 : opt.SHIP_HP_MAX;
        opt.SHIP_MONEY_MIN = opt.SHIP_MONEY_MIN === undefined ? 1 : opt.SHIP_MONEY_MIN;
        opt.SHIP_MONEY_MAX = opt.SHIP_MONEY_MAX === undefined ? 100 : opt.SHIP_MONEY_MAX;
        opt.SHIP_SPEEDS = opt.SHIP_SPEEDS || [ 32 ];
        opt.SHIP_EVADE_MIN = opt.SHIP_EVADE_MIN || 0;
        opt.SHIP_SPAWN_DIST_FROM_CENTER = opt.SHIP_SPAWN_DIST_FROM_CENTER || 0,
        opt.SHIP_CELL_SIZE = opt.SHIP_CELL_SIZE || 16;
        // return pool
        return Clucker.poolMod.create({
            count: rangeByPer(opt.quality, opt.SHIP_COUNT_MIN, opt.SHIP_COUNT_MAX),
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var game = sm.game;
                // dir
                obj.data.dir = 0;
                obj.data.dirDelta = shipDirDelta();
                // stats
                var stat = obj.stat = {};
                stat.hpMax = rangeByPer(opt.quality, opt.SHIP_HP_MIN, opt.SHIP_HP_MAX);
                stat.hp = stat.hpMax;
                stat.money = rangeByPer(opt.quality, opt.SHIP_MONEY_MIN, opt.SHIP_MONEY_MAX);
                stat.evade = opt.SHIP_EVADE_MIN; // evade
                // sheetkey
                obj.data.cellIndex = 0;
                obj.data.sheetKey = 'ship-type-one';
                // start dir
                shipSetDir(obj, Math.floor(Math.random() * 8));
                // start out of bounds
                var dist = opt.SHIP_SPAWN_DIST_FROM_CENTER;
                obj.x = game.cx - dist + Math.round(dist * 2 * Math.random());
                obj.y = obj.h * -1;
                obj.w = opt.SHIP_CELL_SIZE;
                obj.h = opt.SHIP_CELL_SIZE;
                // speed and heading
                obj.pps = opt.SHIP_SPEEDS[ Math.round( (opt.SHIP_SPEEDS.length - 1) * opt.quality ) ];
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
}(this['shipsMod'] = {}));

