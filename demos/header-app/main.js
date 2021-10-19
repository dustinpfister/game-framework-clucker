
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
        sm.layers.background = sm.layers.images[0]; //'gray';
        canvasMod.draw(sm.layers, 'background', 0);
        // draw logo overlay once
        //canvasMod.draw(sm.layers, 'background', 3, 'rgba(0,0,0,0.3)');
        //var canvas = sm.layers[3].canvas,
        //textOptions = { align: 'center', fontSize: 60, baseLine:'middle', fillStyle: 'rgba(255,255,255,0.5)'};
        //canvasMod.draw(sm.layers, 'print', 3, 'dustinpfister.github.io', canvas.width / 2, canvas.height / 2, textOptions);

        canvasMod.draw(sm.layers, 'background', 3, sm.layers.images[1]);

        // sm.pause
        sm.pause = false;
    },
    // what to do on each update
    update: function(sm, secs){
        if(sm.pause){
            sm.fps = 1;
        }else{
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
