



// create an sm object
var sm = gameFrame.smCreateMain({
    currentState: 'loader', 
    width: 640,
    height: 480,
    game:{},
    loader: {
        startState: 'gameTime',
        images: { // load images ./img
            baseURL: '/demos/chicken-cooker-sheets/img/ccsheets-32',
            count: 6
        }
    }
});

// hard coded sm level constants
sm.CHICKENS_COUNT = 30;
sm.CHICKENS_MIN_ACTIVE = 1;
sm.CHICKENS_RADIUS_START = 400;
sm.CHICKENS_RADIUS = 200;
sm.CHICKENS_PPS_MIN = 64;
sm.CHICKENS_PPS_MAX = 256;
sm.CHICKENS_SIZE = 64;

// this will need to be adjusted when using a higher res sprit sheet
sm.CHICKENS_CELL_SIZE = 32;

sm.game = gameMod.create({});




// a game state
gameFrame.smPushState(sm, {
    name: 'gameTime',
    buttons: {},
    start: function(sm){
        sm.layers.background = sm.layers.images[0];
        canvasMod.draw(sm.layers, 'background', 0);

        // create sprite sheets
        var size = sm.CHICKENS_CELL_SIZE;
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [2, 4], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [3, 5], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-cooked', 1, size, size);

    },
    update: function(sm, secs){
        gameMod.update(sm.game, sm, secs);
    },
    draw: function(sm, layers){
        var canvas = layers[1].canvas,
        ctx = layers[1].ctx;
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'stateButtons', 1, sm);

        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.chickens);

        canvasMod.draw(layers, 'pool-solid', 1, sm.game.blasts, {fillStyle: 'rgba(255, 255, 0, 0.5)' });

        // printing score
        canvasMod.draw(layers, 'print', 1, 'score : ' + sm.game.score, 10, 10, {fontSize: 20});
        canvasMod.draw(layers, 'print', 1, 'cpm avg : ' + sm.game.cpm.avg, 10, 30, {fontSize: 20});
        canvasMod.draw(layers, 'print', 1, 'max active: ' + sm.game.spawn.currentMaxActive, 10, 50, {fontSize: 20});
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
