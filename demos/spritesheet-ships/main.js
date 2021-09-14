
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
        // random start location, and heading
        obj.x = Math.floor(640 * Math.random());
        obj.y = Math.floor(480 * Math.random());
        obj.heading = randomHeading();
        obj.data.fast = Math.random() > 0.5 ? true: false;
        obj.pps = obj.data.fast ? 128: 32;
        // other values
        //obj.data.homeRadian = Math.PI * 2 / pool.objects.length * obj.i;
        //obj.data.deltaRadian = 0;
        //obj.data.radian = obj.data.homeRadian;
        //obj.data.radius = 200;
    },
    update: function (obj, pool, sm, secs){
        // update heading
        //obj.heading = Math.PI + Math.atan2(240 - (obj.y + 32), 320 - (obj.x + 32));
        //var fast = true;
        // SETTING CELL INDEX BASED ON HEADING AND SPEED
        var dir = Math.round( obj.heading / (Math.PI * 2) * 8 );
        dir = dir >= 8 ? 7 : dir;
        obj.data.cellIndex = 2 * dir + (obj.data.fast ? 1: 0);
        // USING OLD IMGD METHOD FOR NOW
        obj.data.imgD = sm.layers.spriteSheets['ship-type-one'].cells[obj.data.cellIndex];

        poolMod.moveByPPS(obj, secs);
        poolMod.wrap(obj, {x: 0, y: 0, width: 640, height: 480});
// wrapping

/*
        if(!utils.boundingBox(obj.x, obj.y, obj.w, obj.h, -32, -32, 640 + 32, 480 + 32)){
            obj.x = utils.mod(obj.x + 32, 640 + 64) - 32;
            obj.y = utils.mod(obj.y + 32, 480 + 64) - 32;
        }
*/
        //obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
        //obj.data.radian += obj.data.deltaRadian;
        //obj.data.radian = utils.mod(obj.data.radian, Math.PI * 2);  
        //obj.lifespan = 1;
        //obj.x = 320 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
        //obj.y = 240 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
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
