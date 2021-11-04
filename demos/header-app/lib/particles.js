
(function(gameMod){

    var DEFAULT_POOL_SIZE = 100;


    // create particles object pool helper
    var createParticles = function(createOpt){
        createOpt = createOpt || {};
        return Clucker.poolMod.create({
            count: DEFAULT_POOL_SIZE,
            secsCap: 0.25,
            spawn: function(part, pool, sm, opt){
                part.lifespan = 1;
                part.data.sx = opt.sx === undefined ? 0 : opt.sx;
                part.data.sy = opt.sy === undefined ? 0 : opt.sy;
                part.x = part.data.sx;
                part.y = part.data.sy;
                part.w = 8;
                part.h = 8;
                part.pps = 32;
                part.heading = Math.PI * 2 * Math.random();
            },
            update: function (part, pool, sm, secs){
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
         var i = opt.count = opt.count || 10;
         while(i--){
             Clucker.poolMod.spawn(particles, sm, opt);
         }
    };

}(this['particlesMod'] = {}));