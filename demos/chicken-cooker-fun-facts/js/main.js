// create an sm object
var sm = gameFrame.smCreateMain({
        currentState: 'loader',
        width: 640,
        height: 480,
        game: {},
        loader: {
            startState: 'gameTime',
            images: { // load images ./img
                baseURL: '/demos/chicken-cooker-fun-facts/img/cc-fun-facts',
                count: 8
            }
        }
    });

// CONSTANTS
sm.CHICKENS_COUNT = 50;                   // the pool size for chickens
sm.CHICKENS_MIN_ACTIVE = 3;               // the min amount of active chickens
sm.CHICKENS_SPAWN_RATE_SLOWEST = 1.0;     // the slowest spawn rate
sm.CHICKENS_SPAWN_RATE_FASTEST = 0.125;   // the highest spawn rate
sm.CPM_DSECS = 5;                         // the duration in secs used for a sample to figure CPM
sm.CPM_MAX_SAMPLES = 12;                  // max count of samples for CPM
sm.CHICKEN_COOKED_DELAY = 2;              // The delay that a cooked state chicken remains on the canvas
sm.MAX_ACTIVE_CPM = 125;                  // the CPM rate to get to to have the full effect on current max active
sm.CHICKENS_RADIUS_START = 400;           // the start radius for a chicken
sm.CHICKENS_RADIUS = 200;                 // the inner bounds radius for a chicken
sm.CHICKENS_PPS_MIN = 64;                 // min pixels per second for chicken speed
sm.CHICKENS_PPS_MAX = 256;                // max pixels per second for chicken speed
sm.CHICKENS_SIZE = 64;                    // the scaled size of chickens
sm.CHICKENS_CELL_SIZE = 32;               // this will need to be adjusted when using a higher res sprite sheet

sm.game = gameMod.create({});

// a game state
gameFrame.smPushState(sm, {
    name: 'gameTime',
    buttons: {},
    start: function (sm) {
        // create sm.funFacts
        sm.funFacts = funFactsMod.create(sm);

        // background
        sm.layers.background = sm.layers.images[0];
        canvasMod.draw(sm.layers, 'background', 0);

        // create chicken sprite sheets
        var size = sm.CHICKENS_CELL_SIZE;
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [4, 6], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [5, 7], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-cooked', 1, size, size);

        // create fun facts sheets
        funFactsMod.createSheets(sm, [2, 3]);

    },
    update: function (sm, secs) {
        gameMod.update(sm.game, sm, secs);

        funFactsMod.update(sm, sm.funFacts, secs);


    },
    draw: function (sm, layers) {
        // clear and draw any buttons
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'stateButtons', 1, sm);
        // pools
        canvasMod.draw(layers, 'pool-cc', 1, sm);
        // spawn bar
        canvasMod.draw(layers, 'spawn-bar', 1, sm);
        // fun facts guy
        canvasMod.draw(layers, 'fun-facts-guy', 1, sm);
        // info
        canvasMod.draw(layers, 'info', 1, sm);
    },
    events: {
        pointerStart: function (e, pos, sm) {
            // spawn a blast
            poolMod.spawn(sm.game.blasts, sm, {
                pos: pos
            });
            // set funFacts mod know whats up
            funFactsMod.userAction(sm.funFacts, 'pointerStart', pos);
        },
        pointerMove: function (e, pos, sm) {},
        pointerEnd: function (e, pos, sm) {}
    }
});
// start the state machine
gameFrame.smSetState(sm, 'loader');
sm.loop();
