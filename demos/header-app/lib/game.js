
(function(gameMod){

    var SHIP_SPEEDS = [30, 60, 100, 150],
    SHIP_COUNT_MAX = 60,
    SHIP_HP_MIN = 1,
    SHIP_HP_MAX = 25,
    SHIP_MONEY_MIN = 1,                     // min and max money values for ships
    SHIP_MONEY_MAX = 1000,
    SHIP_SPAWN_DIST_FROM_CENTER = 200,
    SHIP_SPAWN_RATE = 1.25,                 // spawn rate in secs
    UNIT_COUNT_MAX = 10,                    // MAX UNIT POOL SIZE (1 to 40)
    UNIT_SIZE = 50,
    UNIT_RANGE_MIN = 1.5,
    UNIT_RANGE_MAX = 5,
    SHOTS_COUNT_MAX = 50,
    SHOTS_SPEEDS = [100, 150, 200]


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
        opt.shipSpeedPer = opt.shipSpeedPer === undefined ? 1 : opt.shipSpeedPer;
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
                stat.money = SHIP_MONEY_MIN + Math.round( (SHIP_MONEY_MAX - SHIP_MONEY_MIN) * opt.shipMoneyPer );
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
                //obj.pps = SHIP_SPEEDS[Math.floor(Math.random() * SHIP_SPEEDS.length)];
                obj.pps = SHIP_SPEEDS[ Math.round( (SHIP_SPEEDS.length - 1) * opt.shipSpeedPer ) ];
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

    var onTargetHit = function(ship, shot){
        var stat = ship.stat;
        stat.hp -= 1;
        stat.hp = stat.hp < 0 ? 0 : stat.hp;
        // spawn part for shot explosion
        partOpt = { effectType: 'explosion', maxSize: 32, sx: shot.x + shot.w / 2, sy: shot.y  + shot.h / 2, colors: [255, 255, 255] };
        particlesMod.spawn(sm.game.particles, partOpt, sm);
        if(stat.hp === 0){
            // step money
            sm.game.money += stat.money;
            // call on ship death method
            sm.game.onShipDeath(sm.game, ship, sm);
            // spawn particles for ship death
            partOpt = { effectType: 'death', maxSize: 128, sx: ship.x + ship.w / 2, sy: ship.y  + ship.h / 2, colors: [255, 0, 0] };
            particlesMod.spawn(sm.game.particles, partOpt, sm);
            // purge the ship
            Clucker.poolMod.purge(sm.game.ships, ship, sm);
        }
        shot.lifespan = 0;
        return true;
    };


/********* ********** **********
  UNITS
********** ********** *********/

    // get current unit pool positions where a unit can be placed
    var getUnitPositions = function(units){
        var cellX = 0, cellY = 0, x, y,
        positions = [];
        while(cellY <= 3){
            y = UNIT_SIZE + UNIT_SIZE * cellY;
            cellX = 0;
            while(cellX <= 9){
                x = 150 + UNIT_SIZE * cellX;
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

    // get ships in range of unit
    var getShipsInRange = function(unit, sm){
        var ships = Clucker.poolMod.getActiveObjects(sm.game.ships),
        maxDist = UNIT_SIZE * unit.stat.range;   
        return ships.filter(function(ship){
            return Clucker.poolMod.getDistanceToObj(unit, ship) < maxDist && ship.y > 0 && ship.x > 0;
        });
    };

    // create units object pool helper
    var createUnits = function(opt){
        opt = opt || {};
        opt.unitCountPer = opt.unitCountPer === undefined ? 1 : opt.unitCountPer;
        opt.unitRangePer = opt.unitRangePer === undefined ? 1 : opt.unitRangePer;
        opt.shotSpeedPer = opt.shotSpeedPer === undefined ? 1 : opt.shotSpeedPer;
        return Clucker.poolMod.create({
            //count: UNIT_COUNT_MAX,
            count: 1 + Math.round(opt.unitCountPer * (UNIT_COUNT_MAX - 1)),
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                obj.data.fillStyle = 'rgba(0,255,128,0.5)';
                // stats
                var stat = obj.stat = {};
                stat.fireRate = 0.5;
                var shotIndex = Math.round( (SHOTS_SPEEDS.length - 1) * opt.shotSpeedPer );
                stat.shotPPS = SHOTS_SPEEDS[shotIndex];
                stat.range = UNIT_RANGE_MIN + Math.round( (UNIT_RANGE_MAX - UNIT_RANGE_MIN) * opt.unitRangePer );
                // fire secs to find out if the unit will fire or not
                obj.data.fireSecs = 0;
                // sheetkey
                //obj.data.cellIndex = 0;
                //obj.data.sheetKey = 'ship-type-one';
                // start pos
                var cell = sm.game.unitCells[sm.game.unitCellIndex];
                if(cell){
                    var pos = {};
                    pos.x = cell.x * UNIT_SIZE;
                    pos.y = cell.y * UNIT_SIZE;
                    sm.game.unitCellIndex += 1;
                }else{
                    var positions = getUnitPositions(pool);
                    var pos = positions[Math.floor(positions.length * Math.random())];
                }

                obj.x = pos.x; obj.y = pos.y; obj.w = UNIT_SIZE; obj.h = UNIT_SIZE;
            },
            update: function (unit, pool, sm, secs){
                unit.data.fireSecs += secs;
                if(unit.data.fireSecs >= unit.stat.fireRate){
                    unit.data.fireSecs %= unit.stat.fireRate;
                    var allTargets = getShipsInRange(unit, sm);
                    if(allTargets.length > 0){
                        // just select first target for now
                        var target = allTargets[0];
                        // fire a shot
                        Clucker.poolMod.spawn(sm.game.shots, sm, {
                            x: unit.x + unit.w / 2 - 5,
                            y: unit.y + unit.h / 2 - 5,
                            a: shotMod.getShootAtAngle(unit, target, 'method1'),
                            unit: unit,
                            targetPool: sm.game.ships,
                            onTargetHit: onTargetHit,
                            homingActive: true,
                            homingTarget: target,
                            maxDist: unit.stat.range * UNIT_SIZE,
                            maxDPS: 180
                        });
                    }
                }
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
            shots: shotMod.createPool(opt),
            particles: particlesMod.create(),
            unitCellIndex: 0,
            unitCells: opt.unitCells || [],
            onShipDeath: opt.onShipDeath || function(game){},
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
        Clucker.poolMod.update(game.shots, secs, sm);
        particlesMod.update(game.particles, secs, sm);
        // spawn
        game.spawnSecs += secs;
        if(game.spawnSecs >= SHIP_SPAWN_RATE){
            Clucker.poolMod.spawn(game.ships, sm);
            game.spawnSecs = 0;
        }
        // spawn unit
        Clucker.poolMod.spawn(game.units, sm);
    };

    // user clicked
    gameMod.clickAt = function(sm, pos){

    };

}(this['gameMod'] = {}));