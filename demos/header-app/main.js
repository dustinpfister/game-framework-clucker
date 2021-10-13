
console.log('Using clucker v' +this['Clucker'].ver)



// create an sm object
var sm = Clucker.createMain({
    currentState: 'game', // set starting state object to use
    canvasContainer: '#banner',
    width: 800,
    height: 300,
    game: gameMod.create()
});

// add at least one state object
Clucker.pushState(sm, {
    name: 'game',
    // start hook will just fire once when the state object starts
    start: function(sm, canvasMod){
        // draw background once
        sm.layers.background ='gray';
        canvasMod.draw(sm.layers, 'background', 0);
        // spawn
        Clucker.poolMod.spawnAll(sm.game.pool, sm, {});
    },
    // what to do on each update
    update: function(sm, secs){
        gameMod.update(sm.game, secs);
    },
    // draw will be called after each update
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'pool', 1, sm.game.pool);
        canvasMod.draw(layers, 'print', 1, sm.game.text, sm.game.x, sm.game.y, sm.game.printOptions);
    },
    // events for this state
    events: {
        pointerStart: function(e, pos, sm){
            sm.game.pointerDown = true;
        },
        pointerMove: function(e, pos, sm){
            if(sm.game.pointerDown){
                sm.game.cx = pos.x;
                sm.game.cy = pos.y;
            }
        },
        pointerEnd: function(e, pos, sm){
            sm.game.pointerDown = false;
            sm.game.cx = 150;
            sm.game.cy = 150;
        }
    }
});
// start the state machine
Clucker.setState(sm, 'game');
sm.loop();
