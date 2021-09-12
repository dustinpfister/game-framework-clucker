// create an sm object
var sm = gameFrame.smCreateMain({
    currentState: 'game', // set starting state object to use
    width: 640,
    height: 480,
    fps: 5,
    game: {
        homePoints: [],
        printOptions: {
            align: 'center',
            baseLine: 'middle',
            fontSize: 40
        }
    }
});

// add at least one state object
gameFrame.smPushState(sm, {
    name: 'game',
    // start hook will just fire once when the state object starts
    start: function(sm){
        // draw background once
        sm.layers.background = 'blue';
        canvasMod.draw(sm.layers, 'background', 0);
        // set up points
        var canvas = sm.layers[0].canvas,
        x = canvas.width / 2,
        y = canvas.height / 2,
        w = 400,
        h = 400;
        // home points, and points
        sm.game.homePoints = canvasMod.createPoints(sm.layers, 'box', x, y, w, h);
        sm.game.points = canvasMod.createPoints(sm.layers, 'box', x, y, w, h);
    },
    // what to do on each update
    update: function(sm, secs){
         var i = 0, len = sm.game.homePoints[0].length;
         while(i < len){
             sm.game.points[0][i] = sm.game.homePoints[0][i] - 40 + Math.round(80 * Math.random());
             i += 1;
         }
    },
    // draw will be called after each update
    draw: function(sm, layers){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'points', 1, sm.game.points, 0, 0, {fill:'black'});
        //canvasMod.draw(layers, 'print', 1, sm.game.text, sm.game.x, sm.game.y, sm.game.printOptions);
    },
    // events for this state
    events: {
        pointerStart: function(e, pos, sm){
        },
        pointerMove: function(e, pos, sm){
 
        },
        pointerEnd: function(e, pos, sm){

        }
    }
});
// start the state machine
gameFrame.smSetState(sm, 'game');
sm.loop();
