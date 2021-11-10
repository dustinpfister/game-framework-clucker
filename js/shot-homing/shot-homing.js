
(function(shotMod){

    var DEFAULT_SHOT_POOL_COUNT = 100,
UNIT_SIZE = 32;

/*
    var getDistanceToObj = function(obj1, obj2){
        var x1 = obj2.x + obj2.w / 2,
        y1 = obj2.y + obj2.h / 2,
        x2 = obj1.x + obj1.w / 2,
        y2 = obj1.y + obj1.h / 2;
        return Clucker.utils.distance(x1, y1, x2, y2);
    };
*/

    // get target angle
    var getTargetAngle = function(unit, target){
        var x = ( target.x + target.w / 2 ) - ( unit.x + unit.w / 2 ),
        y = ( target.y + target.h / 2 ) - ( unit.y + unit.h / 2 );
        return Math.atan2(y, x);
    };

    // CREATE A FUTURE TARGET
    var createFutureTarget = function(target, secs){
        return Object.assign({}, target, { // future target after secs
            x: target.x + Math.cos(target.heading) * target.pps * secs,
            y: target.y + Math.sin(target.heading) * target.pps * secs
        });
    };

    // THE GET SHOOT AT ANGLE METHODS
    var getShootAtMethods = {
        // method1 is just basicly using Math.atan2 with adjusted values
        method1 : function(unit, target){
            return getTargetAngle(unit, target);
        },
        // method2 involves creating a future target and shooting as that
        // seems to work okay, most of the time but is far from perfect it will
        // be way off for certian values when it comes to playing around with shot
        // and ship PPS values
        method2 : function(unit, target){
            var a1 = getTargetAngle(unit, target),
            // adjust secsStandard based on target speed
            secsStandard = 1, //1 - 0.85 * (target.pps / SHIP_PPS[SHIP_PPS.length - 1] ),
            futureTarget1 = createFutureTarget(target, secsStandard),
            d1 = Clucker.utils.distance(unit.x, unit.y, futureTarget1.x, futureTarget1.y), // distance to future target
            secsShot = d1 / unit.stat.shotPPS,
            //secsForHit = secsShot / secsStandard,
            futureTarget2 = createFutureTarget(target, secsShot),
            a2 = getTargetAngle(unit, futureTarget2);
            return a2;
        }
    };

/********* ********** **********
  PUBLIC METHODS
********** ********** *********/

    // get a shoot at angle
    shotMod.getShootAtAngle = function(unit, target, methodName){
         methodName = methodName || 'method2';
         var method = getShootAtMethods[methodName];
         return method(unit, target);
    };


    // hit check helper used in the update method of a shot pool
    var hitCheck = function(shot, targetPool, onTargetHit){
        // get a collection of hit targets
        if(targetPool){
            var hitTargets = Clucker.poolMod.getOverlaping(shot, targetPool),
            i = hitTargets.length, target;
            // loop hitTargets array
            while(i--){
                // current hit target
                target = hitTargets[i];
                // call onTargetHit method for this target
                if(onTargetHit(target, shot)){
                     // true return value of onTargetHit method
                     // can result in break
                     break;
                }
            }
        }
    };

    // create and return an object pool for shots
    shotMod.createPool = function(opt){
        opt = opt || {};
        return Clucker.poolMod.create({
            count: opt.count || DEFAULT_SHOT_POOL_COUNT,
            secsCap: 0.25,
            spawn: function(obj, pool, sm, spawnOpt){
                obj.data.fillStyle = 'rgba(64,64,64,0.7)';
                // stats
                var stat = obj.stat = {};
                // sheetkey
                //obj.data.cellIndex = 0;
                //obj.data.sheetKey = 'ship-type-one';
                // start pos
                obj.data.targetPool = spawnOpt.targetPool || null;
                obj.data.onTargetHit = spawnOpt.onTargetHit || opt.onTargetHit || function(ship, shot){ console.log('hit');};

                obj.data.unit = spawnOpt.unit || {};
                obj.x = spawnOpt.x || 0;
                obj.y = spawnOpt.y || 0;
                obj.w = 10;
                obj.h = 10;
                obj.heading = spawnOpt.a || 0;
                obj.pps = obj.data.unit.stat.shotPPS || 32;
                obj.lifespan = 2;
            },
            update: function (shot, pool, sm, secs){
                var canvas = sm.layers[0].canvas;
                Clucker.poolMod.moveByPPS(shot, secs);
                Clucker.poolMod.wrap(shot, canvas, 32);
                shot.lifespan = 2;
                // hit check
                var targetPool = shot.data.targetPool || opt.targetPool || null;
                //onTargetHit = shot.data.onTargetHit || opt.onTargetHit || function(ship, shot){ console.log('hit');};
                hitCheck(shot, targetPool, shot.data.onTargetHit);
                // purge shot if distance is to far
                var d = Clucker.poolMod.getDistanceToObj(shot, shot.data.unit);
                if(d > shot.data.unit.stat.range * UNIT_SIZE){
                    shot.lifespan = 0;
                }
            }
        });
    };


}(this['shotMod'] = {}));