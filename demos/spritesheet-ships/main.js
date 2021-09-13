
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


sm.game.ships = poolMod.create({
    count: 8,
    secsCap: 0.25,
    disableLifespan: true,
    spawn: function(obj, pool, sm, opt){
        // USING OLD IMGD METHOD FOR NOW
        obj.data.image = sm.layers.images[0];
        obj.data.cellIndex = 0;
        obj.data.cellSecs = 0;

        obj.data.homeRadian = Math.PI * 2 / pool.objects.length * obj.i;
        obj.data.deltaRadian = 0;
        obj.data.radian = obj.data.homeRadian;
        obj.data.radius = 200;
    },
    update: function (obj, pool, sm, secs){
        // USING OLD IMGD METHOD FOR NOW
       obj.data.cellSecs += secs;
       if(obj.data.cellSecs > 0.1){
           obj.data.cellIndex += 1;
           obj.data.cellIndex %= 4;
           obj.data.cellSecs = 0;
       }
       obj.data.imgD = sm.layers.spriteSheets['ship-type-one'].cells[obj.data.cellIndex];

       obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
       obj.data.radian += obj.data.deltaRadian;
       obj.data.radian = utils.mod(obj.data.radian, Math.PI * 2);  
       obj.lifespan = 1;
       obj.x = 320 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
       obj.y = 240 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
    }
});


// a game state
gameFrame.smPushState(sm, {
    name: 'game',
    buttons: {},
    start: function(sm){

        // drawing background once
        canvasMod.draw(sm.layers, 'background', 0);



        canvasMod.createSpriteSheetGrid(sm.layers, 'ship-type-one', 0, 32, 32);

        // sheets look good
        console.log(sm.layers.spriteSheets);

        poolMod.spawnAll(sm.game.ships, sm, {});

    },
    update: function(sm, secs){

        poolMod.update(sm.game.ships, secs, sm);
    },
    draw: function(sm, layers){

        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'print', 1, sm.currentState, 10, 10);
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
