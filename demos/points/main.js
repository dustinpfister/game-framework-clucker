// create an sm object
var sm = Clucker.gameFrame.smCreateMain({
    currentState: 'game', // set starting state object to use
    width: 640,
    height: 480,
    fps: 30,
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

sm.TARGET_POINT_RADIUS = 15;

// get a new random target point object with given x, y, and r values
var randomTargetPoint = function(x, y, r){
    var radian = Math.PI * 2 * Math.random();
    return {
        x: Math.round(x + Math.cos(radian) * r),
        y: Math.round(y + Math.sin(radian) * r)
    };
};

// new random traget helper with given sm object, and point index
var newRandomTarget = function(sm, i){
    return randomTargetPoint(sm.game.homePoints[0][i], sm.game.homePoints[0][i + 1], sm.TARGET_POINT_RADIUS);
};

// create target points array for first time
var createTargetPoints = function(sm){
   var targets = [],
   i = 0,x, y,
   len = sm.game.homePoints[0].length;
   while(i < len){
       var randomPoint = newRandomTarget(sm, i);
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
        w = 500,
        h = 500;
        // home points, and points
        sm.game.homePoints = canvasMod.createPoints(sm.layers, 'box', x, y, w, h);
        sm.game.points = canvasMod.createPoints(sm.layers, 'box', x, y, w, h);
        sm.game.targetPoints = createTargetPoints(sm);
    },
    // what to do on each update
    update: function(sm, secs){
         var i = 0, len = sm.game.homePoints[0].length;
         while(i < len){
             var x = sm.game.points[0][i],
             y = sm.game.points[0][i + 1],
             tx = sm.game.targetPoints[0][i],
             ty = sm.game.targetPoints[0][i + 1];

             if(x < tx){
                x += 1;
             }
             if(x > tx){
                x -= 1;
             }
             if(y < ty){
                y += 1;
             }
             if(y > ty){
                y -= 1;
             }

             sm.game.points[0][i] = x;
             sm.game.points[0][i + 1] = y;

             // get new random point
             if(x === tx && y === ty){
                 var randomPoint = newRandomTarget(sm, i);
                 sm.game.targetPoints[0][i] = randomPoint.x;
                 sm.game.targetPoints[0][i + 1] = randomPoint.y;
             }


             //sm.game.points[0][i] = sm.game.homePoints[0][i] - 40 + Math.round(80 * Math.random());
             i += 2;
         }
    },
    // draw will be called after each update
    draw: function(sm, layers, canvasMod){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'points', 1, sm.game.points, 0, 0, {fill: 'rgba(0,255,255,0.5)'});
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
