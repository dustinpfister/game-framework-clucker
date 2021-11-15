
(function (gameMod) {

    var DEFAULT_POOL_SIZE = 100;

    var EFFECTS = {};

    // debris effect
    EFFECTS.debris = function (opt) {
        var i = opt.partCount = opt.partCount === undefined ? 10 : opt.partCount,
        partOptions = [];
        while (i--) {
            partOptions.push({
                effect: 'debris',
                colors: opt.colors || [0,255,0],
                maxLifespan: 0.5 + Math.random() * 2,
                pps: 28 + Math.round(100 * Math.random()),
                heading: Math.PI * 2 * Math.random(),
                DPS: -180 + Math.round(360 * Math.random()),
		sizeChange: false,
                sx: opt.sx,
                sy: opt.sy,
                maxSize: 6,
                w: 6,
                h: 6
            });
        }
        return partOptions;
    };

    // explosion effect
    EFFECTS.explosion = function (opt) {
        return [{
            effect: 'explosion',
            colors: opt.colors || [0,255,0],
            maxLifespan: 1,
            sx: opt.sx,
            sy: opt.sy,
            sizeChange: true,
            maxSize: opt.maxSize || 64,
            w: 0,
            h: 0
        }];
    };

    // ship death effect
    EFFECTS.death = function (opt) {
        var i = opt.partCount,
        partOptions = EFFECTS.explosion(opt);
        return partOptions.concat(EFFECTS.debris(opt));
    };

    // message effect
    EFFECTS.mess = function (opt) {
        return [{
            effect: 'mess',
            colors: opt.colors || [255,255,0],
            pps: 32,
            heading: Math.PI * 1.5,
            maxLifespan: opt.maxLifespan === undefined ? 1.5 : opt.maxLifespan,
            sx: opt.sx,
            sy: opt.sy,
            mess: opt.mess || 'None',
            sizeChange: false,
            w: opt.w || 32,
            h: opt.h || 32
        }];
    };

    // create particles object pool helper
    var createParticles = function (createOpt) {
        createOpt = createOpt || {};
        return Clucker.poolMod.create({
            count: DEFAULT_POOL_SIZE,
            secsCap: 0.25,
            spawn: function (part, pool, sm, opt) {
                part.data.effect = opt.effect || '';
                part.data.mess = opt.mess || '';
                // colors
                part.data.colors = opt.colors || [255,255,255];
                // setting lifespan
                part.data.maxLifespan = opt.maxLifespan === undefined ? 1 : opt.maxLifespan;
                part.lifespan = part.data.maxLifespan;
                // start position
                part.data.sx = opt.sx === undefined ? 0 : opt.sx;
                part.data.sy = opt.sy === undefined ? 0 : opt.sy;
                part.x = part.data.sx;
                part.y = part.data.sy;
                // size
                part.data.maxSize = opt.maxSize || 32;
                if(part.data.sizeChange = opt.sizeChange || false){
                    part.w = 0;
                    part.h = 0;
                }else{
                    part.w = opt.w || 0;
                    part.h = opt.h || 0;
                }
                // speed and heading
                part.pps = opt.pps || 0;
                part.heading = opt.heading || 0;
                // Degrees Per Second
                part.data.DPS = opt.DPS || 0;
            },
            update: function (part, pool, sm, secs) {
                var lifePer = part.lifespan / part.data.maxLifespan;
                // alpha effect
                var alpha = lifePer;
                var cArr = part.data.colors;
                part.data.fillStyle = 'rgba(' + cArr[0] + ',' + cArr[1] + ',' + cArr[2] + ',' + alpha + ')';
                part.heading += Math.PI / 180 * part.data.DPS * secs;
                // move by pps
                Clucker.poolMod.moveByPPS(part, secs);
                // if size change
                if(part.data.sizeChange){
                    var size = part.data.maxSize * (1 - lifePer);
                    part.w = size;
                    part.h = size;
                    part.x = part.data.sx - size / 2;
                    part.y = part.data.sy - size / 2;
                }
            }
        });
    };

    /********* ********** **********
    PUBLIC METHODS
     ********** ********** *********/

    // create a pool of particles
    particlesMod.create = function (opt) {
        var particles = createParticles(opt);
        return particles;
    };

    // public update method
    particlesMod.update = function (particles, secs, sm) {
        Clucker.poolMod.update(particles, secs, sm);
    };

    // spawn particles
    particlesMod.spawn = function (particles, opt, sm) {
        opt = opt || {};
        var i = opt.partCount = opt.partCount || 9,
        partOptions = EFFECTS[opt.effectType || 'death'](opt);
        while (i--) {
            Clucker.poolMod.spawn(particles, sm, partOptions[i]);
        }
    };

}
    (this['particlesMod'] = {}));
