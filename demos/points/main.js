// create an sm object
var sm = Clucker.gameFrame.smCreateMain({
    currentState: 'game', // set starting state object to use
    width: 640,
    height: 480,
    fps: 5,
    game: {
        points: [],
        targetPoints: [],
        homePoints: [],
        printOptions: {
            align: 'center',
            baseLine: 'middle',
            fontSize: 40
        }
    }
});

var randomTargetPoint = function(x, y, r){
    var radian = Math.PI * 2 * Math.random();
    return {
        x: Math.round(x + Math.cos(radian) * r),
        y: Math.round(y + Math.sin(radian) * r)
    };
};

var createTargetPoints = function(sm){
   var targets = [],
   i = 0,x, y,
   len = sm.game.homePoints[0].length;
   while(i < len){
       var randomPoint = randomTargetPoint(sm.game.homePoints[0][i], sm.game.homePoints[0][i + 1], 5);
       targets.push(randomPoint.x, randomPoint.y);
       i += 2;
   }
   return [targets];
};

// add at least one state object
Clucker.gameFrame.smPushState(sm, {
    name: 'game',
    // start hook will just fire once when the state object starts
    start: function(sm, canvasMod){
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
        sm.game.targetPoints = createTargetPoints(sm);
console.log(sm.game.homePoints[0]);
console.log(sm.game.targetPoints[0]);
    },
    // what to do on each update
    update: function(sm, secs){
         var i = 0, len = sm.game.homePoints[0].length;
         while(i < len){
             //sm.game.points[0][i] = sm.game.homePoints[0][i] - 40 + Math.round(80 * Math.random());
             i += 1;
         }
    },
    // draw will be called after each update
    draw: function(sm, layers, canvasMod){
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
Clucker.gameFrame.smSetState(sm, 'game');
sm.loop();
