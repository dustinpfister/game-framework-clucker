// create an sm object
var sm = Clucker.gameFrame.smCreateMain({
    currentState: 'mainMenu', 
    width: 640,
    height: 480,
    game: {}
});

// a main menu state
Clucker.gameFrame.smPushState(sm, {
    name: 'mainMenu',
    buttons: {
        newGame: { x: 100, y: 100, w: 64, h:64, desc: 'New Game', onClick: function(e, pos, sm, button){
            Clucker.gameFrame.smSetState(sm, 'game');
        }}
    },
    start: function(sm, canvasMod){
        canvasMod.draw(sm.layers, 'background', 0);
    },
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'print', 1, sm.currentState, 10, 10);
        canvasMod.draw(layers, 'stateButtons', 1, sm);
    }
});
// a game state
Clucker.gameFrame.smPushState(sm, {
    name: 'game',
    buttons: {
        back: { x: 100, y: 100, w: 64, h:64, desc: 'Back', onClick: function(e, pos, sm, button){
            Clucker.gameFrame.smSetState(sm, 'mainMenu');
        }}
    },
    start: function(sm, canvasMod){
        canvasMod.draw(sm.layers, 'background', 0);
    },
    update: function(sm, secs){

    },
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'print', 1, sm.currentState, 10, 10);
        canvasMod.draw(layers, 'stateButtons', 1, sm);
    },
    events: {
        pointerStart: function(e, pos, sm){},
        pointerMove: function(e, pos, sm){},
        pointerEnd: function(e, pos, sm){}
    }
});
// start the state machine
Clucker.gameFrame.smSetState(sm, 'mainMenu');
sm.loop();
