// create an sm object
var sm = gameFrame.smCreateMain({
    currentState: 'loader', 
    width: 640,
    height: 480,
    game:{},
    loader: {
        startState: 'gameTime',
        images: { // load 0.png - 2.png at ./img
            //baseURL: '/demos/chicken-cooker/img/skin-zelda-32',
            //baseURL: '/demos/chicken-cooker/img/skin-mine1-32',
            //baseURL: '/demos/chicken-cooker/img/skin-emme1-32',
            //baseURL: '/demos/chicken-cooker/img/skin-emme1-128',
            baseURL: '/demos/chicken-cooker/img/skin-emme1-128-color',
            count: 3
        }
    }
});

sm.game = gameMod.create();


// a game state
gameFrame.smPushState(sm, {
    name: 'gameTime',
    buttons: {},
    start: function(sm){
        sm.layers.background = sm.images[2];
        canvasMod.draw(sm.layers, 'background', 0);
    },
    update: function(sm, secs){
        gameMod.update(sm.game, sm, secs);
    },
    draw: function(sm, layers){
        var canvas = layers[1].canvas,
        ctx = layers[1].ctx;
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'stateButtons', 1, sm);
        canvasMod.draw(layers, 'pool', 1, sm.game.chickens);
        canvasMod.draw(layers, 'pool', 1, sm.game.blasts, {fillStyle: 'rgba(255, 255, 0, 0.5)' });
        canvasMod.draw(layers, 'print', 1, 'score: ' + sm.game.score, 10, 10, {fontSize: 20});
    },
    events: {
        pointerStart: function(e, pos, sm){
            // spawn a blast
            poolMod.spawn(sm.game.blasts, sm, { pos: pos });
        },
        pointerMove: function(e, pos, sm){},
        pointerEnd: function(e, pos, sm){}
    }
});
// start the state machine
gameFrame.smSetState(sm, 'loader');
sm.loop();
