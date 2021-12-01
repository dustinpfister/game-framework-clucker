
(function(gameMod){

    var SHIP_SPEEDS = [30, 45, 65, 80],
    SHIP_COUNT_MIN = 5,
    SHIP_COUNT_MAX = 30,
    SHIP_CELL_SIZE = 48,
    SHIP_HP_MIN = 1,
    SHIP_HP_MAX = 10,
    SHIP_MONEY_MIN = 1,                     // min and max money values for ships
    SHIP_MONEY_MAX = 1000,
    SHIP_SPAWN_DIST_FROM_CENTER = 200,
    SHIP_SPAWN_RATE = 1.25,                 // spawn rate in secs
    SHIP_EVADE_MIN = 0.1,
    UNIT_COUNT_MIN = 3                     // MIN UNIT POOL SIZE (1 to 40) && <= UNIT_COUNT_MAX
    UNIT_COUNT_MAX = 10,                    // MAX UNIT POOL SIZE (1 to 40)
    UNIT_SIZE = 50,
    UNIT_RANGE_MIN = 1.5,
    UNIT_RANGE_MAX = 5;
    // these values are still set in units.js
    //UNIT_CELL_FPS = 12,
    //UNIT_FIRE_RATE = 1;
    //SHOTS_COUNT_MAX = 50,
    //SHOTS_SPEEDS = [85, 110, 135];


    var rangeByPer = Clucker.utils.valueByRange;

/********* ********** **********
  PUBLIC METHODS
********** ********** *********/

    // public create game state method
    gameMod.create = function(opt){
        opt = opt || {};
        opt.quality = opt.quality || 0;
        var game = {
            sm: opt.sm || {},
            money: opt.money || 0,
            kills: opt.kills || 0,
            quality: opt.quality || 0,
            stats:{
                activeShips : 0,
                totalShips: 0
            },
            ships: shipsMod.createShips({
                quality: opt.quality,
                SHIP_COUNT_MIN: SHIP_COUNT_MIN,
                SHIP_COUNT_MAX: SHIP_COUNT_MAX,
                SHIP_HP_MIN: SHIP_HP_MIN,
                SHIP_HP_MAX: SHIP_HP_MAX,
                SHIP_EVADE_MIN: SHIP_EVADE_MIN,
                SHIP_SPAWN_DIST_FROM_CENTER: SHIP_SPAWN_DIST_FROM_CENTER,
                SHIP_CELL_SIZE: SHIP_CELL_SIZE
            }),
            units: unitsMod.createUnits({
               quality: opt.quality,
               count: rangeByPer(opt.quality, UNIT_COUNT_MIN, UNIT_COUNT_MAX),
               unitSize: UNIT_SIZE,
               unitRangeMin: UNIT_RANGE_MIN,
               unitRangeMax: UNIT_RANGE_MAX
            }),
            shots: shotMod.createPool({
                count: 100
            }),
            particles: particlesMod.create(),
            unitCellIndex: 0,
            unitCells: opt.unitCells || [],
            onShipDeath: opt.onShipDeath || function(game){},
            cx: 400,
            cy: 150,
            spawnSecs: 0
        };

        game.stats.totalShips = game.ships.objects.length;
        // spawn unit
        //Clucker.poolMod.spawnAll(game.units, game.sm, {typeIndex: 0, quality: game.quality});

        return game;
    };

    // public update method
    gameMod.update = function(sm, secs){
        var game = sm.game;
        // update game.pool
        Clucker.poolMod.update(game.ships, secs, sm);
        Clucker.poolMod.update(game.units, secs, sm);
        Clucker.poolMod.update(game.shots, secs, sm);
        particlesMod.update(game.particles, secs, sm);
        // spawn
        game.spawnSecs += secs;
        if(game.spawnSecs >= SHIP_SPAWN_RATE){
            Clucker.poolMod.spawn(game.ships, sm);
            game.spawnSecs = 0;
        }
        // spawn unit
        Clucker.poolMod.spawnAll(game.units, sm, {typeIndex: 0, quality: game.quality});
    };

    // user clicked
    gameMod.clickAt = function(sm, pos){

    };

}(this['gameMod'] = {}));