
// create an sm object
var sm = gameFrame.smCreateMain({
    currentState: 'loader', 
    width: 640,
    height: 480,
    game: {},
    loader: {
        images: {
            baseURL: '/demos/spritesheet-ships/img',
            count: 1
        }
    }
});

// get a random heading
var randomHeading = function(){
    return Math.PI * 2 / 8 * Math.floor( 8 * Math.random());
};

// set up the ships pool
sm.game.ships = poolMod.create({
    count: 8,
    secsCap: 0.25,
    heading: 0,
    w: 64,
    h: 64,
    disableLifespan: true,
    spawn: function(obj, pool, sm, opt){
        // USING OLD IMGD METHOD FOR NOW
        obj.data.image = sm.layers.images[0];
        obj.data.cellIndex = 0;
        obj.data.cellSecs = 0;
        // random start location, and heading, and speed
        obj.x = Math.floor(640 * Math.random());
        obj.y = Math.floor(480 * Math.random());
        obj.heading = randomHeading();
        obj.data.fast = Math.random() > 0.5 ? false: true;
        obj.pps = obj.data.fast ? 256 : 32;

    },
    update: function (obj, pool, sm, secs){
        // SETTING CELL INDEX BASED ON HEADING AND SPEED
        var dir = Math.round( obj.heading / (Math.PI * 2) * 8 );
        dir = dir >= 8 ? 7 : dir;
        obj.data.cellIndex = 2 * dir + (obj.data.fast ? 0 : 1);
        // USING OLD IMGD METHOD FOR NOW
        obj.data.imgD = sm.layers.spriteSheets['ship-type-one'].cells[obj.data.cellIndex];
        // move by pps and wrap
        poolMod.moveByPPS(obj, secs);
        poolMod.wrap(obj, {x: 0, y: 0, width: 640, height: 480});
    }
});

// a game state
gameFrame.smPushState(sm, {
    name: 'game',
    buttons: {},
    start: function(sm){
        canvasMod.draw(sm.layers, 'background', 0);
        canvasMod.createSpriteSheetGrid(sm.layers, 'ship-type-one', 0, 32, 32);
        poolMod.spawnAll(sm.game.ships, sm, {});
    },
    update: function(sm, secs){
        poolMod.update(sm.game.ships, secs, sm);
    },
    draw: function(sm, layers){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'stateButtons', 1, sm);
        canvasMod.draw(layers, 'pool', 1, sm.game.ships);
    },
    events: {
        pointerStart: function(e, pos, sm){},
        pointerMove: function(e, pos, sm){},
        pointerEnd: function(e, pos, sm){}
    }
});
// start the state machine
gameFrame.smSetState(sm, 'loader');
sm.loop();
