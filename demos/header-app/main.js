
console.log('Using clucker v' +this['Clucker'].ver)



// create an sm object
var sm = Clucker.createMain({
    currentState: 'loader',
    canvasContainer: '#logo-wrap', //'#banner',
    width: 800,
    height: 300,
    canvasLayers: 4, // 0-background, 1-forground, 2-buttons-reserved, 3-logo
    game: gameMod.create(),
    loader: {
        startState: 'game',
        images: { // load images ./img
            baseURL: '/demos/header-app/img/ships',
            count: 2
        }
    }
});

// add at least one state object
Clucker.pushState(sm, {
    name: 'game',
    buttons: {
        pause: {x: 800 - 64 - 8, y: 200, w: 64, h: 64, desc: 'pause', onClick: function(e, pos, sm){ 
            //console.log(sm);
            sm.pause = !sm.pause; 
        }}
    },
    // start hook will just fire once when the state object starts
    start: function(sm, canvasMod){
        // draw background once
        canvasMod.draw(sm.layers, 'background', 0, sm.layers.images[0]);
        // draw logo overlay once
        canvasMod.draw(sm.layers, 'background', 3, sm.layers.images[1]);
        // sm.pause
        sm.pause = false;
    },
    // what to do on each update
    update: function(sm, secs){
        // if pause set fps to 1
        if(sm.pause){
            sm.fps = 1;
        }else{
            // else if not pause set fps to 30 and update game state
            sm.fps = 30;
            gameMod.update(sm, secs);
        }
    },
    // draw will be called after each update
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'pool', 1, sm.game.ships);
        canvasMod.draw(layers, 'stateButtons', 2, sm);
    },
    // events for this state
    events: {
        pointerStart: function(e, pos, sm){
            gameMod.clickAt(sm, pos);
        }
    }
});
// start the state machine
Clucker.setState(sm, 'loader');
sm.loop();
