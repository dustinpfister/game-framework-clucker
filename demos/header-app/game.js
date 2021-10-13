
(function(gameMod){

    // create ships object pool helper
    var createShips = function(){
        return Clucker.poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var game = sm.game;
                obj.x = game.cx - obj.w / 2;
                obj.y = game.cy - obj.h / 2;
                obj.pps = 128;
                obj.heading = Math.PI / 180 * Math.round(360 * Math.random());
                //obj.data.homeRadian = Math.PI * 2 / pool.objects.length * obj.i;
                //obj.data.deltaRadian = 0;
                //obj.data.radian = obj.data.homeRadian;
                //obj.data.radius = 50 + Math.round(100 * Math.random());
            },
            update: function (obj, pool, sm, secs){

Clucker.poolMod.moveByPPS(obj, secs);
var canvas = sm.layers[0].canvas;
Clucker.poolMod.wrap(obj, canvas, 32);

               //obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
               //obj.data.radian += obj.data.deltaRadian;
               //obj.data.radian = Clucker.utils.mod(obj.data.radian, Math.PI * 2);  
               //obj.lifespan = 1;
               //obj.x = 400 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
               //obj.y = 150 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
            }
        });
    };

    // public create game state method
    gameMod.create = function(){
        var game = {
            pool: createShips(),
            cx: 400,
            cy: 150,
            x: 0,
            y: 0,
            dir: 1,
            dx: 0,
            printOptions: {
                align: 'center',
                baseLine: 'middle',
                fontSize: 40
            },
            pointerDown: false
        };
        return game;
    };

    gameMod.update = function(sm, secs){
        // update game.pool
        Clucker.poolMod.update(sm.game.pool, secs, sm);
        // spawn
        Clucker.poolMod.spawn(sm.game.pool, sm);
    };

}(this['gameMod'] = {}));