console.log('Using clucker v' + Clucker.ver);

// main state machine object
var sm = Clucker.createMain({
    appName: 'header-app',
    canvasContainer: '#logo-wrap', //'#banner',
    width: 800,
    height: 300,
    canvasLayers: 4, // 0-background, 1-forground, 2-buttons, 3-logo
    game: {},
    loader: {
        startState: 'game',
        images: {
            baseURL: '/demos/header-app/img/ships',
            count: 4
        }
    }
});
// main game state
Clucker.pushState(sm, {
    name: 'game',
    buttons: {
        pause: {
            x: 800 - 64 - 8, 
            y: 200, 
            w: 64, 
            h: 64, 
            desc: '',
            imageIndex: 2,
            imageStats: {x:0, y:0, w:32, h:32}, 
            onClick: function(e, pos, sm){ 
                sm.pause = !sm.pause; 
            }
        }
    },
    start: function(sm, canvasMod){
        // shake
        sm.shakeObj = {
            secs: 0,
            secsMax: 1,
            maxRadius: 8,
            layers:[1]
        };
        // using the hashPer to set the number of ships
        var art = articleMod.getArtObj({
            wordGrades: [500, 1200, 5000]
        });
        // creating a map for unit positons using the articalMod.createMap method
        var unitMap = articleMod.createMap(art);
        // try to get a save state for startMoney
        var save = Clucker.storage.get(sm.appName),
        startMoney = 0;
        if(!save){
            Clucker.storage.set(sm.appName, { money: startMoney });
        }else{
            startMoney = save.money;
        }
        sm.game = gameMod.create({
           unitCells: unitMap.cells,
           money: startMoney,
           shipCountPer: 1,
           shipHPPer: 0.1, //0.6,
           shipSpeedPer: 0.2,
           shipMoneyPer: art.wordPers[2],
           unitCountPer: art.wordPers[0],
           unitRangePer: art.wordPers[1],
           shotSpeedPer: 1,
           onShipDeath : function(game, ship, sm){
               console.log('ship death, saving...');
               Clucker.storage.set(sm.appName, { money: game.money });
               sm.shakeObj.secs = sm.shakeObj.secsMax;
           }
        });
        // draw background and overlay once on start hook
        canvasMod.draw(sm.layers, 'background', 0, sm.layers.images[0]);
        canvasMod.draw(sm.layers, 'background', 3, sm.layers.images[1]);
        // sprite sheet
        canvasMod.createSpriteSheetGrid(sm.layers, 'ship-type-one', 3, 32, 32);
        // sm.pause
        sm.pause = false;
    },
    update: function(sm, secs){
        // if pause set fps to 1
        if(sm.pause){
            sm.fps = 1;
        }else{
            // else if not pause set fps to 30 and update game state
            sm.fps = 30;
            // update game
            gameMod.update(sm, secs);
            // screen shake update
            var i = sm.shakeObj.layers.length;
            sm.shakeObj.secs -= secs;
            sm.shakeObj.secs = sm.shakeObj.secs < 0 ? 0 : sm.shakeObj.secs;
            if(sm.shakeObj.secs > 0){
                while(i--){
                    var ctx = sm.layers[ sm.shakeObj.layers[i] ].ctx;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    var maxRadius = sm.shakeObj.maxRadius,
                    r = maxRadius * (sm.shakeObj.secs / sm.shakeObj.secsMax),
                    x = r * -1 + ( r * 2) * Math.random(),
                    y = r * -1 + ( r * 2) * Math.random();
                    ctx.translate(x, y);
                }
            }else{
                while(i--){
                    var ctx = sm.layers[ sm.shakeObj.layers[i] ].ctx;
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
            }
        }
    },
    draw: function(sm, layers, canvasMod){
        var canvas = layers[1].canvas;
        // clear layer 1
        canvasMod.draw(layers, 'clear', 1);
        // draw units
        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.units, { spriteDraw: function(unit, ctx){
            if(unit.active){
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.lineWidth = 3;
                var r = unit.stat.range * 50;
                ctx.arc(unit.x + unit.w / 2, unit.y + unit.h / 2, r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.lineWidth = 1;
            }
        }});
        // draw ships
        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.ships, { spriteDraw: function(ship, ctx){
            if(ship.active){
                ctx.fillStyle = 'rgba(128,128,128, 0.5)';
                ctx.fillRect(ship.x, ship.y, 16, 3);
                ctx.fillStyle = 'rgba(0,255,0,0.7)';
                var stat = ship.stat;
                ctx.fillRect(ship.x, ship.y, Math.round(stat.hp / stat.hpMax * 16), 3);
            }
        }});
        // shots
        canvasMod.draw(layers, 'pool-circles', 1, sm.game.shots);
        // particles
        canvasMod.draw(layers, 'part-pool', 1, sm.game.particles);
        // light effect
        var lightPer = (0.5 * (sm.shakeObj.secs / sm.shakeObj.secsMax)).toFixed(2);
        canvasMod.draw(sm.layers, 'background', 1, 'rgba(255,64,0,' + lightPer + ')');
        // draw money
        var dispText = { fillStyle: 'yellow', fontSize: 15};
        canvasMod.draw(layers, 'print', 1, Clucker.utils.formatNumber(sm.game.money), 10, canvas.height - 25, dispText);
        // state buttons on layer 2
        canvasMod.draw(layers, 'clear', 2);
        canvasMod.draw(layers, 'stateButtons', 2, sm);
    },
    events: {
        pointerStart: function(e, pos, sm){
            gameMod.clickAt(sm, pos);
            Clucker.storage.set(sm.appName, { money: sm.game.money });
        }
    }
});
// start the state machine
Clucker.start(sm);
