
(function(shotMod){

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

    // THE GET SHOOT AT ANGLE HELPER
    var method2 = function(unit, target){
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
    };

/********* ********** **********
  PUBLIC METHODS
********** ********** *********/

    shotMod.getShootAtAngle = function(unit, target){
         return method2(unit, target); //getTargetAngle(unit, target);
    };


}(this['shotMod'] = {}));