
(function(gameMod){




    // create particles object pool helper
    var createParticles = function(createOpt){
        createOpt = createOpt || {};
        return Clucker.poolMod.create({
            count: DEFAULT_POOL_SIZE,
            secsCap: 0.25,
            spawn: function(obj, pool, sm, opt){
                obj.x = 0;
                obj.y = 0;
                obj.pps = 32;
                obj.heading = 0;
            },
            update: function (obj, pool, sm, secs){
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

    };

    // spawn partciles
    particlesMod.spawn = function(partciles, sm, opt){
         opt = opt || {};
         Clucker.poolMod.spawn(particles, sm, opt);
    }

}(this['particlesMod'] = {}));