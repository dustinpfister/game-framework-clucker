
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
            count: 3
        }
    }
});

// main game state
Clucker.pushState(sm, {
    name: 'game',
    buttons: {
        pause: {x: 800 - 64 - 8, y: 200, w: 64, h: 64, desc: 'pause', onClick: function(e, pos, sm){ 
            sm.pause = !sm.pause; 
        }}
    },
    start: function(sm, canvasMod){
        // using the hashPer to set the number of ships
        var art = articleMod.getArtObj({
            wordGrades: [500, 1200, 5000]
        });


        var unitMap = articleMod.createMap(art);

        // try to get a save state for startMoney
        var save = Clucker.storage.get(sm.appName),
        startMoney = 0;
        if(!save){
            Clucker.storage.set(sm.appName, { money: startMoney });
        }else{
            startMoney = save.money;
        }

        console.log('hashPer: ' + art.hashPer);
        sm.game = gameMod.create({
           unitCells: [
               {x: 0, y: 0},
               {x: 2, y: 1},
               {x: 4, y: 2},
               {x: 6, y: 3}
           ],
           money: startMoney,
           shipCountPer: 0.5,
           shipHPPer: 0.3,
           shipSpeedPer: 0.2,
           shipMoneyPer: art.wordPers[2],
           unitCountPer: art.wordPers[1],
           unitRangePer: 0.5,
           shotSpeedPer: 1
        });
        // draw background and overlay once on start hook
        canvasMod.draw(sm.layers, 'background', 0, sm.layers.images[0]);
        canvasMod.draw(sm.layers, 'background', 3, sm.layers.images[1]);
        // sprite sheet
        canvasMod.createSpriteSheetGrid(sm.layers, 'ship-type-one', 2, 32, 32);
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
            gameMod.update(sm, secs);
        }
    },
    draw: function(sm, layers, canvasMod){
        var canvas = layers[1].canvas;
        canvasMod.draw(layers, 'clear', 1);
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
        // using new spriteDraw method to draw hpbars
        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.ships, { spriteDraw: function(ship, ctx){
            if(ship.active){
                ctx.fillStyle = 'rgba(128,128,128, 0.5)';
                ctx.fillRect(ship.x, ship.y, 16, 3);
                ctx.fillStyle = 'rgba(0,255,0,0.7)';
                var stat = ship.stat;
                ctx.fillRect(ship.x, ship.y, Math.round(stat.hp / stat.hpMax * 16), 3);
            }
        }});
        canvasMod.draw(layers, 'pool-solid', 1, sm.game.shots);
        // draw money
        var dispText = { fillStyle: 'yellow', fontSize: 15};
        canvasMod.draw(layers, 'print', 1, Clucker.utils.formatNumber(sm.game.money), 10, canvas.height - 25, dispText);
        // state buttons
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
