
(function(gameMod){

    var DEFAULT_POOL_SIZE = 100;


    // create particles object pool helper
    var createParticles = function(createOpt){
        createOpt = createOpt || {};
        return Clucker.poolMod.create({
            count: DEFAULT_POOL_SIZE,
            secsCap: 0.25,
            spawn: function(part, pool, sm, opt){
                // setting lifespan
                part.data.maxLifespan = 0.5 + Math.random() * 2;
                part.lifespan = part.data.maxLifespan;
                // start position
                part.data.sx = opt.sx === undefined ? 0 : opt.sx;
                part.data.sy = opt.sy === undefined ? 0 : opt.sy;
                part.x = part.data.sx;
                part.y = part.data.sy;
                // size
                part.w = 8;
                part.h = 8;
                // speed and heading
                part.pps = 28 + Math.round(100 * Math.random());
                part.heading = Math.PI * 2 * Math.random();
                // Degrees Per Second
                part.data.DPS = -180 + Math.round(360 * Math.random());
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
         var i = opt.count = opt.count || 10;
         while(i--){
             Clucker.poolMod.spawn(particles, sm, opt);
         }
    };

}(this['particlesMod'] = {}));