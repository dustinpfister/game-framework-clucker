// to create an object pool with default hard coded settings
var pool = poolMod.create();
console.log( pool.objects.length ) // 10
console.log( JSON.stringify( pool.objects[0] ) );
// {"active":false,"i":0,"x":0,"y":0,"w":32,"h":32,"heading":0,"pps":32,"lifespan":3,"data":{}}



// create an sm object
var sm = gameFrame.smCreateMain({
    currentState: 'game', // set starting state object to use
    width: 640,
    height: 480,
    game: {
        text: 'Hello World',
        pool: poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool){
                obj.data.homeRadian = Math.PI * 2 / pool.objects.length * obj.i;
                obj.data.deltaRadian = 0;
                obj.data.radian = obj.data.homeRadian;
                obj.data.radius = 200;
            },
            update: function (obj, pool, sm, secs){
               obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
               obj.data.radian += obj.data.deltaRadian;
               obj.data.radian = utils.mod(obj.data.radian, Math.PI * 2);  
               obj.lifespan = 1;
               obj.x = 320 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
               obj.y = 240 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
            }
        }),
        cx: 320,
        cy: 240,
        x: 0,
        y: 0,
        dir: 1,
        dx: 0,
        printOptions: {
            align: 'center',
            baseLine: 'middle',
            fontSize: 40
        },
        pointerDown: false
    }
});

// add at least one state object
gameFrame.smPushState(sm, {
    name: 'game',
    // start hook will just fire once when the state object starts
    start: function(sm){
        // draw background once
        canvasMod.draw(sm.layers, 'background', 0);
        // spawn
        poolMod.spawnAll(sm.game.pool, sm, {});
    },
    // what to do on each update
    update: function(sm, secs){
        sm.game.dx += 64 * secs * sm.game.dir;
        if(sm.game.dx >= 32){
            sm.game.dx = 32;
            sm.game.dir = -1;
        }
        if(sm.game.dx <= -32){
            sm.game.dx = -32;
            sm.game.dir = 1;
        }
        sm.game.x = sm.game.cx + sm.game.dx;
        sm.game.y = sm.game.cy;
        // update game.pool
        poolMod.update(sm.game.pool, secs, sm);
    },
    // draw will be called after each update
    draw: function(sm, layers){
        canvasMod.draw(layers, 'clear', 1);
        canvasMod.draw(layers, 'pool', 1, sm.game.pool);
        canvasMod.draw(layers, 'print', 1, sm.game.text, sm.game.x, sm.game.y, sm.game.printOptions);
    },
    // events for this state
    events: {
        pointerStart: function(e, pos, sm){
            sm.game.pointerDown = true;
        },
        pointerMove: function(e, pos, sm){
            if(sm.game.pointerDown){
                sm.game.cx = pos.x;
                sm.game.cy = pos.y;
            }
        },
        pointerEnd: function(e, pos, sm){
            sm.game.pointerDown = false;
            sm.game.cx = 320;
            sm.game.cy = 240;
        }
    }
});
// start the state machine
gameFrame.smSetState(sm, 'game');
sm.loop();
