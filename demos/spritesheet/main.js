
// create an sm object
var sm = Clucker.gameFrame.smCreateMain({
    currentState: 'loader', 
    width: 640,
    height: 480,
    game: {},
    loader: {
        images: { // load 0.png, and 1.png at ./img
            baseURL: '/demos/spritesheet/img',
            count: 2
        }
    }
});

sm.game.firePellets = Clucker.poolMod.create({
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
       obj.data.imgD = sm.layers.spriteSheets['fire-pellet'].cells[obj.data.cellIndex];

       obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
       obj.data.radian += obj.data.deltaRadian;
       obj.data.radian = Clucker.utils.mod(obj.data.radian, Math.PI * 2);  
       obj.lifespan = 1;
       obj.x = 320 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
       obj.y = 240 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
    }
})

// a game state
Clucker.gameFrame.smPushState(sm, {
    name: 'game',
    buttons: {},
    start: function(sm, canvasMod){

        // drawing background once
        canvasMod.draw(sm.layers, 'background', 0);


/*
        // creating a sprite sheet object with an array of objects like this
        var cellIndex = [
            { x: 0, y:0, w: 32, h: 32 },
            { x: 32, y:0, w: 32, h: 32 }
        ];
        canvasMod.createSpriteSheet(sm.layers, 'sheet-test1', 0, cellIndex);



        // creating a sprite sheet object with a function that will return
        // an array of objects like above
        var cellIndexFunction = function(image, spriteSheet, stack){
            var cellCount = Math.floor(image.width / 32),
            cellIndex = 0,
            cells = [];
            while( cellIndex < cellCount ){
                cells.push({ x: 32 * cellIndex, y:0, w: 32, h: 32 });
                cellIndex += 1;
            }
            return cells;
        };
        canvasMod.createSpriteSheet(sm.layers, 'sheet-test2', 0, cellIndexFunction);


        // however most of the time the built in create sprite sheet grid helper should work
        canvasMod.createSpriteSheetGrid(sm.layers, 'sheet-test3', 0, 32, 32);
*/

        canvasMod.createSpriteSheetGrid(sm.layers, 'fire-pellet', 0, 32, 32);

        // sheets look good
        console.log(sm.layers.spriteSheets);

        Clucker.poolMod.spawnAll(sm.game.firePellets, sm, {});

    },
    update: function(sm, secs){

        Clucker.poolMod.update(sm.game.firePellets, secs, sm);
    },
    draw: function(sm, layers, canvasMod){

        //var canvas = layers[1].canvas,
        //ctx = layers[1].ctx;

        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'print', 1, sm.currentState, 10, 10);
        canvasMod.draw(layers, 'stateButtons', 1, sm);


        // drawing images to the canvas

        // uisng built in method for doing so
        //canvasMod.draw(layers, 'cell', 1, 'fire-pellet', 0, {x: 150, y: 150, w: 64, h: 64});

        //canvasMod.draw(layers, 'cell', 1, 'fire-pellet', 1, {x: 350, y: 150, w: 64, h: 64});

        canvasMod.draw(layers, 'pool', 1, sm.game.firePellets);


        //drawCell(layers, 1, 'sheet-test1', 0, {x: 350, y: 150, w: 64, h: 64})
        //ctx.drawImage(sm.layers.images[0], 0, 0, 32, 32, 200, 200, 64, 64);
        //ctx.drawImage(sm.layers.images[1], 100.5, 29.5);
    },
    events: {
        pointerStart: function(e, pos, sm){},
        pointerMove: function(e, pos, sm){},
        pointerEnd: function(e, pos, sm){}
    }
});
// start the state machine
Clucker.gameFrame.smSetState(sm, 'loader');
sm.loop();
