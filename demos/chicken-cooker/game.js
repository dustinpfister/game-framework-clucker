
(function(api){




/********* ********** ********** **********
 HARD CODED VALUES
********** ********** ********** *********/




    var CHICKENS_COUNT = 30,
    CHICKENS_RADIUS_START = 400,
    CHICKENS_RADIUS = 200,
    CHICKENS_PPS_MIN = 64,
    CHICKENS_PPS_MAX = 256,
    CHICKENS_SIZE = 128,
    CHICKENS_CELL_SIZE = 128; // this will need to be adjusted when using a highher res sprit sheet




/********* ********** ********** **********
 HELPERS
********** ********** ********** *********/
    



    // get a random radian
    var rndRadian = function(){
        return Math.PI * 2 * Math.random();
    };
    // get a position from the center of a canvas with the given radius and angle in radians
    var getPosFromCenter = function(canvas, radius, a){
        return {
            x: canvas.width / 2 + Math.cos(a) * radius - CHICKENS_SIZE / 2,
            y: canvas.height / 2 + Math.sin(a) * radius -CHICKENS_SIZE / 2
        };
    };




/********* ********** ********** **********
 CHICKEN POOL
********** ********** ********** *********/




    // what to do for a chicken that is to be spanwed in
    var onSpawnedChicken = function(obj, pool, sm, opt){
        obj.data.state = 'live'; // 'live' or 'cooked' state
        obj.data.fillStyle = 'gray';
        // set start position
        var startPos = getPosFromCenter(sm.layers[0].canvas, CHICKENS_RADIUS_START, rndRadian());
        obj.x = startPos.x;
        obj.y = startPos.y;
        obj.w = CHICKENS_SIZE;
        obj.h = CHICKENS_SIZE;
        // set speed
        obj.pps = CHICKENS_PPS_MIN + Math.round(( CHICKENS_PPS_MAX - CHICKENS_PPS_MIN) * Math.random());
        // set first target
        obj.data.targetPos = getPosFromCenter(sm.layers[0].canvas, CHICKENS_RADIUS, rndRadian());
        // set delay
        obj.data.delay = 3;
        // image data
        obj.data.cellDir = 1; // 0 for facting left and 1 for facing right
        obj.data.cellIndex = 0;
        obj.data.imgSecs = 0;
        obj.data.image = sm.images[0];
        obj.data.imgD = {sx: 0, sy: 0, sw: CHICKENS_CELL_SIZE, sh: CHICKENS_CELL_SIZE};
    };
    // update a chicken
    var chickenState = {};
    // 'live' chicken state
    chickenState.live = function(obj, pool, sm, secs){
        obj.data.fillStyle = 'gray';
        obj.data.image = sm.images[0];
        // get distance and angle to target position
        var d = utils.distance(obj.x, obj.y, obj.data.targetPos.x, obj.data.targetPos.y),
        a = Math.atan2(obj.data.targetPos.y - obj.y, obj.data.targetPos.x - obj.x);
        // set obj.data.cellDir based on var 'a'
        obj.data.cellDir = Math.abs(a) > Math.PI * 0.5 ? 1 : 0;
        // if distance > min stop distance move to target positon
        if(d > 10){
            // move
            obj.x += Math.cos(a) * obj.pps * secs;
            obj.y += Math.sin(a) * obj.pps * secs;
            // cell index
            obj.data.imgSecs += secs;
            if(obj.data.imgSecs >= 1 / 12){
                obj.data.imgSecs = 0;
                if(obj.data.cellDir === 0){
                    obj.data.cellIndex = obj.data.cellIndex === 0 ? 1 : 0;
                }else{
                    obj.data.cellIndex = obj.data.cellIndex === 4 ? 5 : 4;
                }
                obj.data.imgD.sx = CHICKENS_CELL_SIZE * obj.data.cellIndex;
            }
        }else{
            // set delay and switch to rest state
            obj.data.delay = 3;
            obj.data.state = 'rest';
        }
    };
    // 'rest' chicken state
    chickenState.rest = function(obj, pool, sm, secs){
        // else subtract from delay, and get a new target pos of delay <= 0
        obj.data.delay -= secs;
        // cell 3
        obj.data.imgD.sx = CHICKENS_CELL_SIZE * 2;
        if(obj.data.cellDir === 1){
            obj.data.imgD.sx = CHICKENS_CELL_SIZE * 3;
        }
        if(obj.data.delay <= 0){
            obj.data.targetPos = getPosFromCenter(sm.layers[0].canvas, CHICKENS_RADIUS, rndRadian());
            obj.data.state = 'live';
        }
        var over = poolMod.getOverlaping(obj, sm.game.chickens);
        if(over.length > 0){
            obj.data.targetPos = getPosFromCenter(sm.layers[0].canvas, CHICKENS_RADIUS, rndRadian());
            obj.data.state = 'live';
        }
    };
    // 'cooked' chicken state
    chickenState.cooked = function(obj, pool, sm, secs){
        obj.data.fillStyle = 'red';
        obj.data.image = sm.images[1];
        obj.data.imgD.sx = 0;
        obj.data.delay -= secs;
        if(obj.data.delay <= 0){
            //obj.active = false;
            poolMod.purge(pool, obj, sm);
        }
    };
    // main update chicken method
    var updateChicken = function (obj, pool, sm, secs){  
        obj.lifespan = 1;
        chickenState[obj.data.state].call(obj, obj, pool, sm, secs);
    };
    // on purge of chicken
    var onPurgedChicken = function(obj, pool, sm){
         // if it is a cooked chicken add to score
         if(obj.data.state === 'cooked'){
             sm.game.score += 1;
         };
    };
    // create chicken pool helper
    var createChickenPool = function(){
        return poolMod.create({
            count: CHICKENS_COUNT,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: onSpawnedChicken,
            update: updateChicken,
            purge: onPurgedChicken
        });
    };




/********* ********** ********** **********
 BLASTS POOL
********** ********** ********** *********/




    // create blasts pool helper
    var createBlastsPool = function(){
        return poolMod.create({
            count: 3,
            secsCap: 0.25,
            //disableLifespan: true,
            spawn: function(obj, pool, sm, opt){
                obj.data.cx = opt.pos.x;
                obj.data.cy = opt.pos.y;
                obj.w = 0;
                obj.h = 0;
                obj.data.maxLife = 0.5;
                obj.lifespan = obj.data.maxLife;
            },
            update: function (obj, pool, sm, secs){  
                var per = 1 - obj.lifespan / obj.data.maxLife;
                var size = Math.round(100 * per);
                obj.w = size;
                obj.h = size;
                obj.x = obj.data.cx - obj.w / 2;
                obj.y = obj.data.cy - obj.h / 2;
                sm.game.chickens.objects.forEach(function(chk){
                    if(chk.active){
                        if(chk.data.state === 'live' || chk.data.state === 'rest'){
                            if(utils.boundingBox(chk.x, chk.y, chk.w, chk.h, obj.x, obj.y, obj.w, obj.h)){
                                chk.data.delay = 3;
                                chk.data.state = 'cooked';
                            }
                        }
                    }
                });
            }
        });
    };




/********* ********** ********** **********
 CREATE METHOD
********** ********** ********** *********/




    // create game state object
    api.create = function(){
        var game = {
            score: 0,
            spawn: {
               secs: 0,
               rate: 1.75,
               maxActive: 7
            }
        };
        // chickens pool
        game.chickens = createChickenPool();
        // blasts object pool
        game.blasts = createBlastsPool();
        return game;
    };




/********* ********** ********** **********
 UPDATE THE GAME OBJECT
********** ********** ********** *********/




    api.update = function(game, sm, secs){
        game.spawn.secs += secs;
        if(game.spawn.secs >= game.spawn.rate){
            game.spawn.secs = 0;
            var activeCount = poolMod.getActiveCount(sm.game.chickens);
            if(activeCount < game.spawn.maxActive){
                poolMod.spawn(game.chickens, sm, {});
            }
        }
        poolMod.update(game.chickens, secs, sm);
        poolMod.update(game.blasts, secs, sm);
    };

}(this['gameMod'] = {}));

