
(function(gameMod){

    // create ships object pool helper
    var createShips = function(){
        return Clucker.poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool){
                obj.data.homeRadian = Math.PI * 2 / pool.objects.length * obj.i;
                obj.data.deltaRadian = 0;
                obj.data.radian = obj.data.homeRadian;
                obj.data.radius = 50 + Math.round(100 * Math.random());
            },
            update: function (obj, pool, sm, secs){
               obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
               obj.data.radian += obj.data.deltaRadian;
               obj.data.radian = Clucker.utils.mod(obj.data.radian, Math.PI * 2);  
               obj.lifespan = 1;
               obj.x = 400 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
               obj.y = 150 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
            }
        })
    };

    // public create game state method
    gameMod.create = function(){
        return {
            text: 'Hello World',
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
        }
    };

    gameMod.update = function(game, secs){
        game.dx += 64 * secs * game.dir;
        if(game.dx >= 32){
            game.dx = 32;
            game.dir = -1;
        }
        if(game.dx <= -32){
            game.dx = -32;
            game.dir = 1;
        }
        game.x = game.cx + game.dx;
        game.y = game.cy;
        // update game.pool
        Clucker.poolMod.update(sm.game.pool, secs, sm);

    };

}(this['gameMod'] = {}));