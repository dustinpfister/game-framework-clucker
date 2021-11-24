(function(unitsMod){

    var UNIT_COUNT_MIN = 3                     // MIN UNIT POOL SIZE (1 to 40) && <= UNIT_COUNT_MAX
    UNIT_COUNT_MAX = 10,                    // MAX UNIT POOL SIZE (1 to 40)
    UNIT_SIZE = 50,
    UNIT_RANGE_MIN = 1.5,
    UNIT_RANGE_MAX = 5,
    UNIT_CELL_FPS = 12,
    UNIT_FIRE_RATE = 1,
    UNIT_SHOTS_SPEEDS = [85, 110, 135];

/********* ********** **********
  HELPERS
********** ********** *********/

    var rangeByPer = Clucker.utils.valueByRange;

    // on target hit method
    var onTargetHit = function(ship, shot){
        var stat = ship.stat,
        sx = shot.x + shot.w / 2,
        sy = shot.y  + shot.h / 2,
        partOpt = {};
        // evadeRoll
        var evadeRoll = Math.random();
        if(evadeRoll < ship.stat.evade){
            // if evade
            partOpt = { effectType: 'mess', mess: 'evade',sx: ship.x, sy: ship.y, colors: [255, 255, 0] };
            particlesMod.spawn(sm.game.particles, partOpt, sm);
        }else{
            stat.hp -= 1;
            stat.hp = stat.hp < 0 ? 0 : stat.hp;
            // spawn part for shot explosion
            partOpt = { effectType: 'explosion', maxSize: 32, sx: sx, sy: sy, colors: [255, 255, 255] };
            particlesMod.spawn(sm.game.particles, partOpt, sm);
            if(stat.hp === 0){
                // step money
                sm.game.money += stat.money;
                // step kills
                sm.game.kills += 1;
                // call on ship death method
                sm.game.onShipDeath(sm.game, ship, sm);
                // spawn particles for ship death
                partOpt = { effectType: 'death', maxSize: 128, sx: sx, sy: sy, colors: [255, 0, 0] };
                particlesMod.spawn(sm.game.particles, partOpt, sm);
                partOpt = { effectType: 'mess', mess: '$' + ship.stat.money, sx: ship.x, sy: ship.y, colors: [255, 255, 0] };
                particlesMod.spawn(sm.game.particles, partOpt, sm);
                // purge the ship
                Clucker.poolMod.purge(sm.game.ships, ship, sm);
            }
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
    unitsMod.createUnits = function(opt){
        opt = opt || {};
        return Clucker.poolMod.create({
            count: rangeByPer(opt.quality, UNIT_COUNT_MIN, UNIT_COUNT_MAX), 
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                obj.data.fillStyle = 'rgba(0,255,128,0.5)';
                // stats
                var stat = obj.stat = {};
                stat.fireRate = UNIT_FIRE_RATE;
                var shotIndex = Math.round( (UNIT_SHOTS_SPEEDS.length - 1) * opt.quality );
                stat.shotPPS = UNIT_SHOTS_SPEEDS[shotIndex];
                stat.range = rangeByPer(opt.quality, UNIT_RANGE_MIN, UNIT_RANGE_MAX);
                // fire secs to find out if the unit will fire or not
                obj.data.fireSecs = 0;
                obj.data.fireActive = false;
                obj.data.cellSecs = 0;
                // sheetkey
                obj.data.cellIndex = 0;
                obj.data.sheetKey = 'unit-type-one';
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
                var ud = unit.data,
                allTargets = getShipsInRange(unit, sm),
                ci = ud.cellIndex;
                ud.fireActive = false;
                if(allTargets.length > 0){
                    ud.fireActive = true;
                }
                ud.cellSecs += secs;
                if(ud.cellSecs >= 1 / UNIT_CELL_FPS){
                    if(ud.fireActive && ud.cellIndex < 3){
                       ud.cellIndex += 1;
                    }
                    if(!ud.fireActive && ud.cellIndex > 0){
                       ud.cellIndex -= 1;
                    }
                    ud.cellSecs = 0;
                }
                if(ud.fireActive && ud.cellIndex === 3){
                    ud.fireSecs += secs;
                    if(ud.fireSecs >= unit.stat.fireRate){
                        ud.fireSecs %= unit.stat.fireRate;
                        var target = allTargets[0];
                        // fire a shot
                       shotMod.fire(sm.game.shots, {
                           unit: unit,
                           target: target,
                           targetPool: sm.game.ships,
                           onTargetHit: onTargetHit,
                           maxDist: unit.stat.range * UNIT_SIZE,
                           sheetKey: 'shot-type-one',
                           cellIndexUpdate: function(shot, secs){
                                var sd = shot.data;
                                sd.cellDir = sd.cellDir === undefined ? 1 : sd.cellDir;
                                sd.cellIndex += 1 * sd.cellDir;
                                if(sd.cellIndex >= 4){
                                    sd.cellIndex = 3;
                                    sd.cellDir = -1;
                                }
                                if(sd.cellIndex <= -1){
                                    sd.cellIndex = 0;
                                    sd.cellDir = 1;
                                }
                            }
                       });
                    }
                }
            }
        });
    };

}(this['unitsMod'] = {}));

