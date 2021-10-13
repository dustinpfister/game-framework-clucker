
(function(gameMod){

    var SHIP_SPEEDS = [64, 96, 128];

    // create ships object pool helper
    var createShips = function(){
        return Clucker.poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){
                var game = sm.game;
                // start at center
                obj.x = game.cx - obj.w / 2;
                obj.y = game.cy - obj.h / 2;
                obj.pps = SHIP_SPEEDS[Math.floor(Math.random() * SHIP_SPEEDS.length)];
                obj.heading = Math.PI / 180 * Math.round(360 * Math.random());
            },
            update: function (obj, pool, sm, secs){
                var canvas = sm.layers[0].canvas;
                // move and wrap
                Clucker.poolMod.moveByPPS(obj, secs);
                Clucker.poolMod.wrap(obj, canvas, 32);
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

    // public update method
    gameMod.update = function(sm, secs){
        // update game.pool
        Clucker.poolMod.update(sm.game.pool, secs, sm);
        // spawn
        Clucker.poolMod.spawn(sm.game.pool, sm);
    };

    // user clicked
    gameMod.clickAt = function(sm, pos){
        console.log(pos);
    };

}(this['gameMod'] = {}));