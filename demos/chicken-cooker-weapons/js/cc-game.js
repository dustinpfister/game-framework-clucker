
(function (api) {

    // WEAPONS
    var WEAPONS = {
        frying_pan: {
            key: 'frying_pan',
            blastType: 'singleHit',
            maxBlastRadius: 8,
            damage: [2, 7]
        },
        rocket: {
            key: 'rocket',
            blastType: 'explosion',
            maxBlastRadius: 225,
            damage: [2, 9]
        }
    };

    // cooked Types
    var COOKED_TYPES = [
        {
            desc: 'Drumstick',
            points: 70,
            price: 1
        },
        {
            desc: 'Rotisserie',
            points: 20,
            price: 2
        },
        {
            desc: 'Sandwich',
            points: 8,
            price: 6
        },
        {
            desc: 'Over Rice',
            points: 2,
            price: 15
        }
    ];

    // UPGRADES
    var UPGRADES = {
        global_food_value: {
            key: '',
            desc: 'Global Food Values',
            deltaNext: 10,
            cap: 100,
            applyToState: function(game, upgrade){
                console.log('apply to state for ' + upgrade.key);
            }
        },
        chicken_hp: {
            key: 'chicken_hp',
            desc: 'Reduce Chicken HP',
            deltaNext: 150,
            cap: 100,
            applyToState: function(game, upgrade){
                console.log('apply to state for ' + upgrade.key);
            }
        }
    };
    // set keys
    Object.keys(UPGRADES).forEach(function(key){
        var upgrade = UPGRADES[key];
        upgrade.key = key;
    });

    /********* ********** ********** **********
    HELPERS
     ********** ********** ********** *********/

    // CPM (Cooked Per Minute) call each time a cooked chicken is purged
    var CPMCount = function (game, deltaCount) {
        var cpm = game.cpm;
        var index = cpm.counts.length - 1;
        index = index < 0 ? 0 : index;
        var count = cpm.counts[index] === undefined ? 0 : cpm.counts[index];
        count += deltaCount;
        cpm.counts[index] = count;
    };

    // CPM (Cooked Per Minute)  update method to be called over time
    var CPMupdate = function (game, secs) {
        var cpm = game.cpm,
        len = cpm.counts.length,
        dSecs = sm.CPM_DSECS, // the sample duration time length in secs
        maxSamples = sm.CPM_MAX_SAMPLES; // max counts for dSecs amounts
        cpm.avg = cpm.counts.reduce(function (acc, n) {
                return acc + n;
            }, 0);
        // update cpm.avg
        cpm.avg = (cpm.avg * (60 / dSecs)) / len;
        // look out for NaN
        if (len === 0) {
            cpm.avg = 0;
        }
        // format the number
        cpm.avg = Number(cpm.avg.toFixed(2));
        // add secs to cpm.secs
        cpm.secs += secs;
        if (cpm.secs >= dSecs) {
            cpm.counts.push(0);
            cpm.secs = Clucker.utils.mod(cpm.secs, dSecs);
        }
        // shift out old counts
        if (len >= maxSamples) {
            cpm.counts.shift();
        }
    };

    // set current max active helper
    var maxActiveUpdate = function (game) {
        var spawn = game.spawn,
        cpm = game.cpm,
        avgCPM = cpm.avg > sm.MAX_ACTIVE_CPM ? sm.MAX_ACTIVE_CPM : cpm.avg,
        per = avgCPM / sm.MAX_ACTIVE_CPM,
        deltaActive = Math.round((spawn.maxActive - spawn.minActive) * per);
        spawn.currentMaxActive = spawn.minActive + deltaActive;
    };

    // get a random radian
    var rndRadian = function () {
        return Math.PI * 2 * Math.random();
    };

    // get a position from the center of a canvas with the given radius and angle in radians
    var getPosFromCenter = function (canvas, radius, a) {
        return {
            x: canvas.width / 2 + Math.cos(a) * radius - sm.CHICKENS_SIZE / 2,
            y: canvas.height / 2 + Math.sin(a) * radius - sm.CHICKENS_SIZE / 2
        };
    };

    // update walk cells helper
    var updateWalkCells = function (obj, secs) {
        obj.data.imgSecs += secs;
        if (obj.data.imgSecs >= 1 / 12) {
            obj.data.imgSecs = 0;
            if (obj.data.cellDir === 0) {
                obj.data.cellIndex = obj.data.cellIndex === 0 ? 1 : 0;
            } else {
                obj.data.cellIndex = obj.data.cellIndex === 2 ? 3 : 2;
            }
        }
    };

    /********* ********** ********** **********
    CHICKEN POOL
     ********** ********** ********** *********/

    // set up a chicken object for the first time
    var setupChicken = function (obj, sm) {
        var d = obj.data;
        d.sheetKey = 'chick-walk';
        d.cellIndex = 0;
        d.imageIndex = Math.floor(Math.random() * 2);
        d.stat = {
            hp: 10,
            hpMax: 10,
            recovery: 1.5,
            autoHealRate: 10,
            autoHealPer: 0.1
        };
        d.autoHealSecs = 0;
        d.godMode = false;
        d.godModeSecs = d.stat.recovery;
    };

    // what to do for a chicken that is to be spanwed in
    var onSpawnedChicken = function (obj, pool, sm, opt) {
        obj.data.state = 'live'; // 'live' or 'cooked' state
        // set start position
        var startPos = getPosFromCenter(sm.layers[0].canvas, sm.CHICKENS_RADIUS_START, rndRadian());
        obj.x = startPos.x;
        obj.y = startPos.y;
        obj.w = sm.CHICKENS_SIZE;
        obj.h = sm.CHICKENS_SIZE;
        // set speed
        obj.pps = sm.CHICKENS_PPS_MIN + Math.round((sm.CHICKENS_PPS_MAX - sm.CHICKENS_PPS_MIN) * Math.random());
        // set first target
        obj.data.targetPos = getPosFromCenter(sm.layers[0].canvas, sm.CHICKENS_RADIUS, rndRadian());
        // set delay
        obj.data.delay = 3;
        obj.data.cellDir = 1; // 0 for facing left and 1 for facing right
        obj.data.imgSecs = 0;
        // 'pool-solid'
        obj.data.fillStyle = 'gray';
        // 'pool-sprite'
        obj.data.cellIndex = 0;
        obj.data.sheetKey = 'chick-walk';
        // SETTING AN IMAGE INDEX FOR THE CHICK-WALK SHEET
        obj.data.imageIndex = Math.floor(Math.random() * 2);
        // alpha
        obj.data.alpha = 1;
        // STATS
        var stat = obj.data.stat;
        stat.hp = stat.hpMax;
        // set god mode to false
        obj.data.godMode = false;
    };
    // update a chicken
    var chickenState = {};
    // 'live' chicken state
    chickenState.live = function (obj, pool, sm, secs) {
        obj.data.fillStyle = 'gray';
        obj.data.sheetKey = 'chick-walk';
        obj.data.image = sm.layers.images[0];
        // get distance and angle to target position
        var d = Clucker.utils.distance(obj.x, obj.y, obj.data.targetPos.x, obj.data.targetPos.y),
        a = Math.atan2(obj.data.targetPos.y - obj.y, obj.data.targetPos.x - obj.x);
        // set obj.data.cellDir based on var 'a'
        obj.data.cellDir = Math.abs(a) > Math.PI * 0.5 ? 1 : 0;
        // if distance > min stop distance move to target position
        if (d > 10) {
            // move
            obj.x += Math.cos(a) * obj.pps * secs;
            obj.y += Math.sin(a) * obj.pps * secs;
            updateWalkCells(obj, secs);
        } else {
            // set delay and switch to rest state
            obj.data.delay = 3;
            obj.data.state = 'rest';
        }
    };
    // chicken is heading out
    chickenState.out = function (obj, pool, sm, secs) {
        obj.data.sheetKey = 'chick-walk';
        obj.data.image = sm.layers.images[0];
        if (obj.data.cellDir === 0) {
            obj.x += obj.pps * secs;
        } else {
            obj.x -= obj.pps * secs;
        }
        // update cells
        updateWalkCells(obj, secs);
        // purge if out
        if (obj.x < obj.w * -1 || obj.x > sm.layers[0].canvas.width) {
            Clucker.poolMod.purge(pool, obj, sm);
        }

    };
    // 'rest' chicken state
    chickenState.rest = function (obj, pool, sm, secs) {
        // else subtract from delay, and get a new target pos of delay <= 0
        obj.data.delay -= secs;
        obj.data.sheetKey = 'chick-rest';
        // use rest cell index
        obj.data.cellIndex = 0;
        if (obj.data.cellDir === 1) {
            obj.data.cellIndex = 1;
        }
        if (obj.data.delay <= 0) {
            obj.data.targetPos = getPosFromCenter(sm.layers[0].canvas, sm.CHICKENS_RADIUS, rndRadian());
            obj.data.state = 'live';
        }
        var over = Clucker.poolMod.getOverlaping(obj, sm.game.chickens);
        if (over.length > 0) {
            obj.data.targetPos = getPosFromCenter(sm.layers[0].canvas, sm.CHICKENS_RADIUS, rndRadian());
            obj.data.state = 'live';
        }
    };
    // 'cooked' chicken state
    chickenState.cooked = function (obj, pool, sm, secs) {
        obj.data.fillStyle = 'red';
        obj.data.sheetKey = 'chick-cooked';
        obj.data.delay -= secs;
        // cooked object slowly moves up
        obj.y -= 16 * secs;
        // adjust alpha
        obj.data.alpha = obj.data.delay / sm.CHICKEN_COOKED_DELAY;
        if (obj.data.delay <= 0) {
            Clucker.poolMod.purge(pool, obj, sm);
        }
    };
    // main update chicken method
    var updateChicken = function (obj, pool, sm, secs) {
        obj.lifespan = 1;
        obj.data.alpha = 1;
        // update god mode secs and switch god mode off
        if (obj.data.godMode) {
            obj.data.godModeSecs -= secs;
            obj.data.godModeSecs = obj.data.godModeSecs < 0 ? 0 : obj.data.godModeSecs;
            obj.data.godMode = obj.data.godModeSecs === 0 ? false : true;
            // adjust alpha based on god mode
            if (obj.data.godMode) {
                obj.data.alpha = obj.data.godModeSecs % 0.1 >= 0.05 ? 0.4 : 0.8;
            }
        }
        // autoheal
        var stat = obj.data.stat;
        obj.data.autoHealSecs += secs;
        if (obj.data.autoHealSecs >= stat.autoHealRate) {
            var hpDelta = Math.round(stat.hpMax * stat.autoHealPer);
            stat.hp += hpDelta;
            stat.hp = stat.hp >= stat.hpMax ? stat.hpMax : stat.hp;

            obj.data.autoHealSecs = 0;
        }
        // call current state
        chickenState[obj.data.state].call(obj, obj, pool, sm, secs);

    };
    // on purge of chicken
    var onPurgedChicken = function (obj, pool, sm) {
        // if it is a cooked chicken add to score, money
        if (obj.data.state === 'cooked') {
            CPMCount(sm.game, 1);
            sm.game.score += 1;
            var price = sm.game.COOKED_TYPES[obj.data.cellIndex].price;
            sm.game.money += price;
            sm.game.money = Math.round(sm.game.money);
        };
        obj.data.alpha = 1;
    };
    // create chicken pool helper
    var createChickenPool = function () {
        return Clucker.poolMod.create({
            count: sm.CHICKENS_COUNT,
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

    // get damage
    var getDamage = function (chk, blast) {
        return getDamage[blast.weapon.blastType](chk, blast);
    };
    // sigle hit damage
    getDamage.singleHit = function (chk, blast) {
        var minDam = blast.weapon.damage[0],
        maxDeltaDam = blast.weapon.damage[1];
        return minDam + Math.round(Math.random() * maxDeltaDam);
    };
    // get explosion damage
    getDamage.explosion = function (chk, blast) {
        // distance and dPer
        var x1 = chk.x + chk.w / 2,
        y1 = chk.y + chk.h / 2,
        x2 = blast.x + blast.w / 2,
        y2 = blast.y + blast.h / 2;
        var d = Clucker.utils.distance(x1, y1, x2, y2),
        dPer = 1 - (d / blast.data.size).toFixed(2);
        // apply damage
        return blast.weapon.damage[0] + Math.round(blast.weapon.damage[1] * dPer);
    };

    // set cooked chicken per values
    var setCookedChickenPerValues = function(game){
        var totalPoints = game.COOKED_TYPES.reduce(function(acc, obj){
            return acc + obj.points || 0;
        }, 0);
        game.COOKED_TYPES = game.COOKED_TYPES.map(function(obj){
            obj.per = obj.points / totalPoints;
            return obj;
        });
    };

    // get cooked chicken index
    var getCookedChickenIndex = function(game){
        var roll = Math.random(),
        i = 0,
        per = 0,
        len = game.COOKED_TYPES.length;
        while(i < len - 1){
             per += game.COOKED_TYPES[i].per;
             if(roll < per){
                 break;
             }
             i += 1;
        }
        return i; //Math.floor(Math.random() * 4);
    };

    // create blasts pool helper
    var createBlastsPool = function () {
        return Clucker.poolMod.create({
            count: 3,
            secsCap: 0.25,
            //disableLifespan: true,
            spawn: function (obj, pool, sm, opt) {
                obj.data.cx = opt.pos.x;
                obj.data.cy = opt.pos.y;
                // ref to the weapon object
                obj.weapon = opt.weapon;
                obj.w = 8;
                obj.h = 8;
                // if blast type is explosion obj.w and obj.h will start at zero
                // and increase to size set by weapon
                if (obj.weapon.blastType === 'explosion') {
                    obj.w = 0;
                    obj.h = 0;
                    obj.data.size = obj.weapon.maxBlastRadius;
                }
                obj.data.maxLife = 0.5;
                obj.lifespan = obj.data.maxLife;
            },
            update: function (obj, pool, sm, secs) {
                var per = 1 - obj.lifespan / obj.data.maxLife;
                var size = Math.round(obj.data.size * per);
                // size must be adjusted for explosion types
                if (obj.weapon.blastType === 'explosion') {
                    obj.w = size;
                    obj.h = size;
                }
                obj.x = obj.data.cx - obj.w / 2;
                obj.y = obj.data.cy - obj.h / 2;
                // looping chickens
                var i = 0,
                chk,
                len = sm.game.chickens.objects.length;
                while (i < len) {
                    chk = sm.game.chickens.objects[i];
                    if (chk.active) {
                        if (chk.data.state === 'live' || chk.data.state === 'rest' || chk.data.state === 'out') {
                            // chk overlaps with blast area
                            if (Clucker.utils.boundingBox(chk.x, chk.y, chk.w, chk.h, obj.x, obj.y, obj.w, obj.h)) {
                                // damage
                                if (!chk.data.godMode) {
                                    // get damage
                                    var damage = getDamage(chk, obj);
                                    chk.data.stat.hp -= damage;
                                    chk.data.stat.hp = chk.data.stat.hp < 0 ? 0 : chk.data.stat.hp;
                                    chk.data.godMode = true;
                                    chk.data.godModeSecs = chk.data.stat.recovery;
                                }
                                // chicken is cooked if hp <= 0
                                if (chk.data.stat.hp <= 0) {
                                    setCookedChickenPerValues(sm.game);
                                    chk.data.delay = sm.CHICKEN_COOKED_DELAY;
                                    chk.data.sheetKey = 'chick-cooked';
                                    chk.data.imageIndex = 0;
                                    var cookedIndex = getCookedChickenIndex(sm.game);
                                    var cookedCount = sm.game.stats.cookedTypes[cookedIndex];
                                    cookedCount = cookedCount === undefined ? 0 : cookedCount;
                                    cookedCount += 1;
                                    sm.game.stats.cookedTypes[cookedIndex] = cookedCount;
                                    chk.data.cellIndex = cookedIndex;
                                    chk.data.state = 'cooked';
                                }
                                // break out of loop for singleHit blast type
                                if (obj.weapon.blastType === 'singleHit') {
                                    obj.lifespan = 0;
                                    break;
                                }
                            }
                        }
                    }
                    i += 1;
                }
            }
        });
    };

    /********* ********** ********** **********
    CREATE METHOD
     ********** ********** ********** *********/

    // create upgrades collection helper
    var createUpgradesCollection = function(opt){
        opt = opt || {};
        var upgradeCol = {};
        Object.keys(UPGRADES).forEach(function(key){
            var upgrade = upgradeCol[key] = Object.assign({}, UPGRADES[key]);
            upgrade.levelObj = Clucker.utils.XP.parseByLevel(opt[key] || 1, upgrade.cap, upgrade.deltaNext);
        });
        return upgradeCol;
    };

    // apply upgrades to state helper
    var applyUpgradesToState = function(game){
        Object.keys(game.upgrades).forEach(function(key){
            var upgrade = game.upgrades[key];
            upgrade.applyToState.call(game, game, upgrade);
        });
    };

    // create game state object
    api.create = function (opt, sm) {
        opt = opt || {};
        var game = {
            score: 0,
            money: opt.money === undefined ? 0 : opt.money,
            upgrades: createUpgradesCollection(opt.upgrades),
            WEAPONS: WEAPONS,
            COOKED_TYPES: COOKED_TYPES,
            currentWeapon: 'frying_pan',
            holdFire: false,
            cpm: { // cooked per minute
                secs: 0,
                counts: [],
                avg: 0
            },
            stats: {
                cookedTypes: COOKED_TYPES.map(function(){
                    return 0;
                })
            },
            spawn: {
                secs: 0,
                rate: 3,
                activeCount: 0,
                minActive: sm.CHICKENS_MIN_ACTIVE, // the fixed min active chickens
                maxActive: sm.CHICKENS_COUNT, // the fixed max active chickens
                currentMaxActive: sm.CHICKENS_MIN_ACTIVE // the current max to allow
            }
        };

applyUpgradesToState(game);


console.log(game.upgrades)



        // set cooked chicken per values for first time
        setCookedChickenPerValues(game);
        // chickens pool
        game.chickens = createChickenPool();

        // set up the data objects before spawn
        game.chickens.objects.forEach(function (obj) {
            setupChicken(obj, sm);
        });

        // blasts object pool
        game.blasts = createBlastsPool();
        return game;
    };

    /********* ********** ********** **********
    UPDATE THE GAME OBJECT
     ********** ********** ********** *********/

    api.update = function (game, sm, secs) {
        // SPAWN
        // get and update sm.activeCount
        var activeCount = game.spawn.activeCount = Clucker.poolMod.getActiveCount(game.chickens);
        // adjust spawn rate
        var per = game.spawn.currentMaxActive / sm.CHICKENS_COUNT;
        per = per > 1 ? 1 : per;
        game.spawn.rate = sm.CHICKENS_SPAWN_RATE_SLOWEST - (sm.CHICKENS_SPAWN_RATE_SLOWEST - sm.CHICKENS_SPAWN_RATE_FASTEST) * per;
        // spawn or not
        if (activeCount >= game.spawn.currentMaxActive) {
            game.spawn.secs = 0;
            // if we are above current active
            if (activeCount > game.spawn.currentMaxActive) {
                var chicks_active = Clucker.poolMod.getActiveObjects(sm.game.chickens);
                // get all chickens that are active and in 'live' or 'rest' state
                var chicks_liveRest = chicks_active.filter(function (chk) {
                        return chk.data.state === 'live' || chk.data.state === 'rest'
                    });
                var toOutCount = chicks_liveRest.length - game.spawn.currentMaxActive;
                if (toOutCount > 0) {
                    var i = 0;
                    while (i < toOutCount) {
                        chicks_liveRest[i].data.state = 'out';
                        i += 1;
                    }
                }
            }
        } else {
            // we are below the current max active count, so spawn
            game.spawn.secs += secs;
            if (game.spawn.secs >= game.spawn.rate) {
                game.spawn.secs = 0;
                Clucker.poolMod.spawn(game.chickens, sm, {});
            }
        }
        // update chicken and blast pools
        Clucker.poolMod.update(game.chickens, secs, sm);
        Clucker.poolMod.update(game.blasts, secs, sm);
        // update Cooked Per Minute
        CPMupdate(game, secs);
        // update max active
        maxActiveUpdate(game);
    };

    /********* ********** ********** **********
    ADDITIONAL PUBLIC METHODS
     ********** ********** ********** *********/

    // cycle weapons
    api.cycleWeapons = function (game) {
        var weaponKey = game.currentWeapon,
        keys = Object.keys(game.WEAPONS),
        i = 0;
        while (i < keys.length) {
            if (weaponKey === keys[i]) {
                break;
            }
            i += 1;
        }
        i += 1;
        i %= keys.length;
        game.currentWeapon = keys[i];
    };

    // player click
    api.playerClick = function (game, pos, e) {
        if (!game.holdFire) {
            // spawn a blast
            Clucker.poolMod.spawn(game.blasts, sm, {
                pos: pos,
                weapon: game.WEAPONS[sm.game.currentWeapon]
            });
        }
        // set hold fire back to false if true
        game.holdFire = false;
    };

}
    (this['gameMod'] = {}));
