
// create an sm object
var sm = gameFrame.smCreateMain({
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

// a game state
gameFrame.smPushState(sm, {
    name: 'game',
    buttons: {
        //back: { x: 100, y: 100, w: 64, h:64, disp: 'New Game', onClick: function(e, pos, sm, button){      
        //}}
    },
    start: function(sm){
        // drawing background once
        canvasMod.draw(sm.layers, 'background', 0);

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


console.log(sm.layers.spriteSheets);

    },
    update: function(sm, secs){

    },
    draw: function(sm, layers){
        var canvas = layers[1].canvas,
        ctx = layers[1].ctx;
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'print', 1, sm.currentState, 10, 10);
        canvasMod.draw(layers, 'stateButtons', 1, sm);
        // drawing images to the canvas
        ctx.drawImage(sm.layers.images[0], 0, 0, 32, 32, 200, 200, 64, 64);
        ctx.drawImage(sm.layers.images[1], 100.5, 29.5);
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
