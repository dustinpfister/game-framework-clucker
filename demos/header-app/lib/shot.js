
(function(shotMod){

    // get target angle
    var getTargetAngle = function(unit, target){
        var x = ( target.x + target.w / 2 ) - ( unit.x + unit.w / 2 ),
        y = ( target.y + target.h / 2 ) - ( unit.y + unit.h / 2 );
        return Math.atan2(y, x);
    };

/********* ********** **********
  PUBLIC METHODS
********** ********** *********/

    shotMod.getShootAtAngle = function(unit, target){
         return getTargetAngle(unit, target);
    };


}(this['shotMod'] = {}));