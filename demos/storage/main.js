
console.log('Using clucker v' + Clucker.ver)


// create an sm object
var sm = Clucker.createMain({
    currentState: 'game', // set starting state object to use
    width: 640,
    height: 480,
    game: {
        score: 0,
        pool: Clucker.poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool, sm){

                var canvas = sm.layers[0].canvas;
                obj.w = 64;
                obj.h = 64;
                obj.x = canvas.width / 2 - obj.w / 2;
                obj.y = canvas.height / 2 - obj.h / 2;
                obj.heading = Math.PI * 2 * Math.random();
                obj.pps = 256;

            },
            update: function (obj, pool, sm, secs){

                Clucker.poolMod.moveByPPS(obj, secs);
                Clucker.poolMod.wrap(obj, sm.layers[0].canvas, 32);

            }
        })
    }
});

// add at least one state object
Clucker.pushState(sm, {
    name: 'game',
    // start hook will just fire once when the state object starts
    start: function(sm, canvasMod){
        // draw background once
        canvasMod.draw(sm.layers, 'background', 0);

        // spawn
        Clucker.poolMod.spawn(sm.game.pool, sm, {});
    },
    // what to do on each update
    update: function(sm, secs){

        // update game.pool
        Clucker.poolMod.update(sm.game.pool, secs, sm);
    },
    // draw will be called after each update
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'pool', 1, sm.game.pool);
        canvasMod.draw(layers, 'print', 1, sm.game.score, 10, 10, {});
    },
    // events for this state
    events: {
        pointerStart: function(e, pos, sm){

        },
        pointerMove: function(e, pos, sm){

        },
        pointerEnd: function(e, pos, sm){

        }
    }
});
// start the state machine
Clucker.setState(sm, 'game');
sm.loop();
