

// create an sm object
var sm = Clucker.gameFrame.smCreateMain({
        currentState: 'loader',
        width: 640,
        height: 480,
        game: {},
        loader: {
            startState: 'init',
            images: { // load images ./img
                baseURL: '/demos/chicken-cooker-fun-facts/img/cc-fun-facts',
                count: 8
            }
        }
    });

// CONSTANTS
sm.CHICKENS_COUNT = 50; // the pool size for chickens
sm.CHICKENS_MIN_ACTIVE = 3; // the min amount of active chickens
sm.CHICKENS_SPAWN_RATE_SLOWEST = 1.0; // the slowest spawn rate
sm.CHICKENS_SPAWN_RATE_FASTEST = 0.125; // the highest spawn rate
sm.CPM_DSECS = 5; // the duration in secs used for a sample to figure CPM
sm.CPM_MAX_SAMPLES = 12; // max count of samples for CPM
sm.CHICKEN_COOKED_DELAY = 2; // The delay that a cooked state chicken remains on the canvas
sm.MAX_ACTIVE_CPM = 125; // the CPM rate to get to to have the full effect on current max active
sm.CHICKENS_RADIUS_START = 400; // the start radius for a chicken
sm.CHICKENS_RADIUS = 200; // the inner bounds radius for a chicken
sm.CHICKENS_PPS_MIN = 64; // min pixels per second for chicken speed
sm.CHICKENS_PPS_MAX = 256; // max pixels per second for chicken speed
sm.CHICKENS_SIZE = 64; // the scaled size of chickens
sm.CHICKENS_CELL_SIZE = 32; // this will need to be adjusted when using a higher res sprite sheet


console.log( Clucker.utils.XP.parseByLevel(3, 50, 100) );


// HELPERS

// create a standard back button for a state
var createBackButton = function (toStateKey) {
    return {
        x: 640 - 128 - 32,
        y: 16,
        w: 64,
        h: 64,
        desc: 'Back',
        onClick: function (e, pos, sm, button) {
            Clucker.gameFrame.smSetState(sm, toStateKey);
        }
    }
};

// create a standard back button for a state
var createToGameButton = function () {
    return {
        x: 640 - 64 - 16,
        y: 16,
        w: 64,
        h: 64,
        desc: 'Game',
        onClick: function (e, pos, sm, button) {
            Clucker.gameFrame.smSetState(sm, 'gameTime');
            sm.game.holdFire = true;
        }
    };
};

// simple init state that will just be called once after load state
Clucker.gameFrame.smPushState(sm, {
    name: 'init',
    start: function (sm, canvasMod) {
        // create new game object
        sm.game = gameMod.create({
            upgrades : {
                global_food_value: 2
            }
        }, sm);
        // set button desc for first time
        sm.states.gameTime.buttons.weapon.desc = sm.game.currentWeapon;
        // create sm.funFacts
        sm.funFacts = funFactsMod.create(sm);
        // create chicken sprite sheets
        var size = sm.CHICKENS_CELL_SIZE;
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [4, 6], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [5, 7], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-cooked', 1, size, size);
        // create fun facts sheets
        funFactsMod.createSheets(sm, [2, 3]);
        // background
        sm.layers.background = sm.layers.images[0];
        canvasMod.draw(sm.layers, 'background', 0);
        Clucker.gameFrame.smSetState(sm, 'gameTime');
    }
});

// a game state
Clucker.gameFrame.smPushState(sm, {
    name: 'gameTime',
    buttons: {
        weapon: {
            x: 16,
            y: 480 - 64 - 16,
            w: 64,
            h: 64,
            desc: '',
            onClick: function (e, pos, sm, button) {
                gameMod.cycleWeapons(sm.game);
                button.desc = sm.game.currentWeapon;
                sm.game.holdFire = true;
            }
        },
        menu: {
            x: 640 - 64 - 16,
            y: 16,
            w: 64,
            h: 64,
            desc: 'Menu',
            onClick: function (e, pos, sm, button) {
                Clucker.gameFrame.smSetState(sm, 'mainMenu');
            }
        }
    },
    start: function (sm, canvasMod) {
        // background
        //sm.layers.background = sm.layers.images[0];
        //canvasMod.draw(sm.layers, 'background', 0);
    },
    update: function (sm, secs) {
        gameMod.update(sm.game, sm, secs);
        funFactsMod.update(sm, sm.funFacts, secs);
    },
    draw: function (sm, layers, canvasMod) {
        // clear 
        canvasMod.draw(layers, 'clear', 1);
        // pools
        canvasMod.draw(layers, 'pool-cc', 1, sm);
        // spawn bar
        canvasMod.draw(layers, 'spawn-bar', 1, sm);
        // fun facts guy
        canvasMod.draw(layers, 'fun-facts-guy', 1, sm);
        // info
        canvasMod.draw(layers, 'info', 1, sm);
        // state buttons
        canvasMod.draw(layers, 'stateButtons', 1, sm);
    },
    events: {
        pointerStart: function (e, pos, sm) {
            gameMod.playerClick(sm.game, pos, e);
            // set funFacts mod know whats up
            funFactsMod.userAction(sm.funFacts, 'pointerStart', pos);
        },
        pointerMove: function (e, pos, sm) {},
        pointerEnd: function (e, pos, sm) {}
    }
});

// a main menu state
Clucker.gameFrame.smPushState(sm, {
    name: 'mainMenu',
    buttons: {
        to_game: createToGameButton(),
        stats: {
            x: 320 - 128 - 32,
            y: 240 - 64,
            w: 128,
            h: 128,
            desc: 'Stats',
            onClick: function (e, pos, sm, button) {
                Clucker.gameFrame.smSetState(sm, 'stats');
            }
        },
        upgrades: {
            x: 320 + 32,
            y: 240 - 64,
            w: 128,
            h: 128,
            desc: 'Upgrades',
            onClick: function (e, pos, sm, button) {
                Clucker.gameFrame.smSetState(sm, 'upgrades');
            }
        }
    },
    start: function (sm, canvasMod) {},
    update: function (sm, secs) {
        gameMod.update(sm.game, sm, secs);
    },
    draw: function (sm, layers, canvasMod) {
        // clear
        canvasMod.draw(layers, 'clear', 1);
        // pools
        canvasMod.draw(layers, 'pool-cc', 1, sm);
        // buttons
        canvasMod.draw(layers, 'stateButtons', 1, sm);
    }
});

// a stats state
Clucker.gameFrame.smPushState(sm, {
    name: 'stats',
    buttons: {
        to_game: createToGameButton(),
        back: createBackButton('mainMenu')
    },
    start: function (sm, canvasMod) {},
    update: function (sm, secs) {
        gameMod.update(sm.game, sm, secs);
    },
    draw: function (sm, layers, canvasMod) {
        // clear
        canvasMod.draw(layers, 'clear', 1);
        // pools
        canvasMod.draw(layers, 'pool-cc', 1, sm);
        canvasMod.draw(layers, 'background', 1, 'rgba(0,0,0,0.4)')
        // printing info
        var printOptions = {
            fontSize: 15,
            fillStyle: 'white'
        };
        // print line helper
        var printLine = function (mess, yIndex) {
            Clucker.canvasMod.draw(sm.layers, 'print', 1, mess, 64, 128 + 20 * yIndex, printOptions);
        };
        sm.game.stats.cookedTypes.forEach(function (count, i) {
            count = count || 0;
            printLine(sm.game.COOKED_TYPES[i].desc + ' : ' + count, i);
        });
        // buttons
        canvasMod.draw(layers, 'stateButtons', 1, sm);
    }
});

// a stats state
Clucker.gameFrame.smPushState(sm, {
    name: 'upgrades',
    buttons: {
        to_game: createToGameButton(),
        back: createBackButton('mainMenu')
    },
    start: function (sm, canvasMod) {},
    update: function (sm, secs) {
        gameMod.update(sm.game, sm, secs);
    },
    draw: function (sm, layers, canvasMod) {
        // clear
        canvasMod.draw(layers, 'clear', 1);
        // pools
        canvasMod.draw(layers, 'pool-cc', 1, sm);
        canvasMod.draw(layers, 'background', 1, 'rgba(0,0,0,0.4)')

        // buttons
        canvasMod.draw(layers, 'stateButtons', 1, sm);
    }
});

// start the state machine
Clucker.gameFrame.smSetState(sm, 'loader');
sm.loop();
