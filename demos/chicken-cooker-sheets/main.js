// create an sm object
var sm = gameFrame.smCreateMain({
        currentState: 'loader',
        width: 640,
        height: 480,
        game: {},
        loader: {
            startState: 'gameTime',
            images: { // load images ./img
                baseURL: '/demos/chicken-cooker-sheets/img/ccsheets-32',
                count: 6
            }
        }
    });

// CONSTANTS
sm.CHICKENS_COUNT = 30;                   // the pool size for chickens
sm.CHICKENS_MIN_ACTIVE = 1;               // the min amount of active chickens
sm.CHICKENS_SPAWN_RATE_SLOWEST = 1.0;     // the slowest spawn rate
sm.CHICKENS_SPAWN_RATE_FASTEST = 0.125;   // the highest spawn rate
sm.CPM_DSECS = 5;                         // the duration in secs used for a sample to figure CPM
sm.CPM_MAX_SAMPLES = 12;                  // max count of samples for CPM
sm.CHICKEN_COOKED_DELAY = 1;              // The delay that a cooked state chicken remains on the canvas
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
        sm.layers.background = sm.layers.images[0];
        canvasMod.draw(sm.layers, 'background', 0);

        // create sprite sheets
        var size = sm.CHICKENS_CELL_SIZE;
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [2, 4], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [3, 5], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-cooked', 1, size, size);

    },
    update: function (sm, secs) {
        gameMod.update(sm.game, sm, secs);
    },
    draw: function (sm, layers) {
        var canvas = layers[1].canvas,
        ctx = layers[1].ctx;
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'stateButtons', 1, sm);

        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.chickens);

        canvasMod.draw(layers, 'pool-solid', 1, sm.game.blasts, {
            fillStyle: 'rgba(255, 255, 0, 0.5)'
        });

        // spawn bar
        var w = 300;
        var x = canvas.width / 2 - w / 2;
        var per1 = 0,
        per2,
        per3;
        // main spawn bar
        ctx.fillStyle = 'gray';
        ctx.fillRect(x, 10, w, 25);
        per1 = sm.game.spawn.currentMaxActive / sm.game.spawn.maxActive;
        per2 = per1 / sm.game.spawn.currentMaxActive * sm.game.spawn.activeCount;
        ctx.fillStyle = 'white';
        ctx.fillRect(x, 10, w * per1, 25);
        ctx.fillStyle = 'lime';
        ctx.fillRect(x, 10, w * per2, 25);

        per3 = sm.game.spawn.secs / sm.game.spawn.rate;
        ctx.fillStyle = 'blue';
        ctx.fillRect(x, 35, w * per3, 5);

        // printing score
        var printOptions = {
            fontSize: 15
        };
        canvasMod.draw(layers, 'print', 1, 'score : ' + sm.game.score, 10, 10, printOptions);
        canvasMod.draw(layers, 'print', 1, 'cpm avg : ' + sm.game.cpm.avg, 10, 30, printOptions);
        var spawn = sm.game.spawn;
        canvasMod.draw(layers, 'print', 1, 'active: ' + spawn.activeCount + '/' + spawn.currentMaxActive, 10, 50, printOptions);
        canvasMod.draw(layers, 'print', 1, 'spawn rate: ' + spawn.rate.toFixed(2), 10, 70, printOptions);

    },
    events: {
        pointerStart: function (e, pos, sm) {
            // spawn a blast
            poolMod.spawn(sm.game.blasts, sm, {
                pos: pos
            });
        },
        pointerMove: function (e, pos, sm) {},
        pointerEnd: function (e, pos, sm) {}
    }
});
// start the state machine
gameFrame.smSetState(sm, 'loader');
sm.loop();
