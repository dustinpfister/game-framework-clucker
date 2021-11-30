console.log('Using clucker v' + Clucker.ver);

// main state machine object
var sm = Clucker.createMain({
    appName: 'header-app',
    layerClassName: 'canvas_layer_header_app',
    canvasContainer: '#header-title', //'#logo-wrap', //'#banner',
    width: 800,
    height: 300,
    canvasLayers: 4, // 0-background, 1-foreground, 2-buttons, 3-logo
    game: {},
    loader: {
        startState: 'game',
        images: {
/*
    Image file name  : what it is for
    0.png : background
    1.png : logo 
    2.png : buttons
    3.png : ship0 
    4.png : shot0 
    5.png : unit0 ( blank ) 
    6.png : unit1 ( silo ) 
*/
            
            baseURL: '/demos/header-app/img/ships',
            count: 7
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
            onClick: function(e, pos, sm, button){ 
                sm.pause = !sm.pause;
                button.imageStats.x = sm.pause ? 32 : 0;
            }
        }
    },
    start: function(sm, canvasMod){
		
		console.log(sm.layers[0].canvas.className);
		
        // shake
        sm.shakeObj = {
            secs: 0,
            secsMax: 1,
            maxRadius: 8,
            layers:[1]
        };
        // using the hashPer to set the number of ships
        var art = articleMod.getArtObj({
            wordGrades: [500, 1000, 1800, 2400]
        });
        // creating a map for unit positons using the articalMod.createMap method
        var unitMap = articleMod.createMap(art);
        // try to get a save state for startMoney
        var save = Clucker.storage.get(sm.appName),
        startMoney = 0,
        kills = 0;
        if(!save){
            Clucker.storage.set(sm.appName, { money: startMoney, kills: 0 });
        }else{
            startMoney = save.money === undefined ? startMoney : save.money;
            kills = save.kills === undefined ? kills : save.kills;
        }
        sm.game = gameMod.create({
           sm: sm,
           unitCells: unitMap.cells,
           money: startMoney,
           kills: kills,
           quality: art.pageQuality,
           onShipDeath : function(game, ship, sm){
               Clucker.storage.set(sm.appName, { money: game.money, kills: game.kills });
               sm.shakeObj.secs = sm.shakeObj.secsMax;
           }
        });
        // draw background and overlay once on start hook
        canvasMod.draw(sm.layers, 'background', 0, sm.layers.images[0]);
        canvasMod.draw(sm.layers, 'background', 3, sm.layers.images[1]);
        // sprite sheet
        canvasMod.createSpriteSheetGrid(sm.layers, 'ship-type-one', 3, 32, 32);
        canvasMod.createSpriteSheetGrid(sm.layers, 'shot-type-one', 4, 32, 32);
        canvasMod.createSpriteSheetGrid(sm.layers, 'unit-type-zero', 5, 32, 32);
        canvasMod.createSpriteSheetGrid(sm.layers, 'unit-type-one', 6, 32, 32);
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
        var canvas = layers[1].canvas,
        ctx = layers[1].ctx;
        // clear layer 1
        canvasMod.draw(layers, 'clear', 1);
        // draw units
        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.units, { spriteDraw: function(unit, ctx){
            if(unit.active && unit.data.typeIndex === 1){
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
        canvasMod.draw(layers, 'pool-sprite', 1, sm.game.shots);
        // particles
        canvasMod.draw(layers, 'part-pool', 1, sm.game.particles);
        // light effect
        var lightPer = (0.5 * (sm.shakeObj.secs / sm.shakeObj.secsMax)).toFixed(2);
        canvasMod.draw(sm.layers, 'background', 1, 'rgba(255,64,0,' + lightPer + ')');
        // draw disp text
        var dispText = { fillStyle: 'rgba(255,255,0,0.7)', fontSize: 10 };
        var disp_money = Clucker.utils.formatNumber(sm.game.money);
        canvasMod.draw(layers, 'print', 1, 'Money: ' + disp_money + ', Kills: ' + sm.game.kills, 10, canvas.height - 30, dispText);

        // page quality bar
        canvasMod.draw(layers, 'print', 1, 'Page Quality: ', 10, canvas.height - 15, dispText);
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(75, canvas.height - 15, 100, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#8a8a00';
        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.rect(75, canvas.height - 15, 100 * sm.game.quality, 10);
        ctx.fill();
        ctx.stroke();
        

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
