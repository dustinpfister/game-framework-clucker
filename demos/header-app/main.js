
console.log('Using clucker v' + Clucker.ver);

// main state machine object
var sm = Clucker.createMain({
    canvasContainer: '#logo-wrap', //'#banner',
    width: 800,
    height: 300,
    canvasLayers: 4, // 0-background, 1-forground, 2-buttons, 3-logo
    game: {},
    loader: {
        startState: 'game',
        images: {
            baseURL: '/demos/header-app/img/ships',
            count: 2
        }
    }
});

// main game state
Clucker.pushState(sm, {
    name: 'game',
    buttons: {
        pause: {x: 800 - 64 - 8, y: 200, w: 64, h: 64, desc: 'pause', onClick: function(e, pos, sm){ 
            sm.pause = !sm.pause; 
        }}
    },
    start: function(sm, canvasMod){
        // using the hashPer to set the number of ships
        var art = articleMod.getArtObj();
        console.log(art);
        sm.game = gameMod.create({
           shipCountPer: art.hashPer 
        });
        // draw background and overlay once on start hook
        canvasMod.draw(sm.layers, 'background', 0, sm.layers.images[0]);
        canvasMod.draw(sm.layers, 'background', 3, sm.layers.images[1]);
        // sm.pause
        sm.pause = false;
    },
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
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'pool', 1, sm.game.ships);
        canvasMod.draw(layers, 'stateButtons', 2, sm);
    },
    events: {
        pointerStart: function(e, pos, sm){
            gameMod.clickAt(sm, pos);
        }
    }
});
// start the state machine
Clucker.start(sm);
