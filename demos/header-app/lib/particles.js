
(function(gameMod){

    var DEFAULT_POOL_SIZE = 100;

    var EFFECTS = {};

    // debris effect
    EFFECTS.debris = function(opt){
        var i = opt.count = opt.count === undefined ? 10 : opt.count, 
        partOptions = [];
        while(i--){
            partOptions.push(            {
                maxLifespan: 0.5 + Math.random() * 2,
                pps: 28 + Math.round(100 * Math.random()),
                heading: Math.PI * 2 * Math.random(),
                DPS: -180 + Math.round(360 * Math.random()),
                sx: opt.sx,
                sy: opt.sy,
                w: 6,
                h: 6
            });
        }
        return partOptions;
    };


    // create particles object pool helper
    var createParticles = function(createOpt){
        createOpt = createOpt || {};
        return Clucker.poolMod.create({
            count: DEFAULT_POOL_SIZE,
            secsCap: 0.25,
            spawn: function(part, pool, sm, opt){
                // setting lifespan
                part.data.maxLifespan = opt.maxLifespan === undefined ? 1 : opt.maxLifespan;
                part.lifespan = part.data.maxLifespan;
                // start position
                part.data.sx = opt.sx === undefined ? 0 : opt.sx;
                part.data.sy = opt.sy === undefined ? 0 : opt.sy;
                part.x = part.data.sx;
                part.y = part.data.sy;
                // size
                part.w = opt.w || 0;
                part.h = opt.h || 0;
                // speed and heading
                part.pps = opt.pps || 0;
                part.heading = opt.heading || 0;
                // Degrees Per Second
                part.data.DPS = opt.DPS || 0;
            },
            update: function (part, pool, sm, secs){
                // alpha effect
                var alpha = part.lifespan / part.data.maxLifespan;
                part.data.fillStyle = 'rgba(255,0,0,' + alpha + ')';
                part.heading += Math.PI / 180 * part.data.DPS * secs;
                // move by pps
                Clucker.poolMod.moveByPPS(part, secs);
            }
        });
    };


/********* ********** **********
  PUBLIC METHODS
********** ********** *********/

    // create a pool of particles
    particlesMod.create = function(opt){
        var particles = createParticles(opt);
        return particles;
    };

    // public update method
    particlesMod.update = function(particles, secs, sm){
        Clucker.poolMod.update(particles, secs, sm);
    };

    // spawn partciles
    particlesMod.spawn = function(particles, opt, sm){
         opt = opt || {};
         var i = opt.count = opt.count || 10,
         partOptions = EFFECTS.debris(opt);
         while(i--){
             Clucker.poolMod.spawn(particles, sm, partOptions[i]);
         }
    };

}(this['particlesMod'] = {}));