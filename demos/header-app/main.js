
console.log('Using clucker v' + Clucker.ver);

// main state machine object
var sm = Clucker.createMain({
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
            wordGrades: [1200, 5000]
        });
        console.log(art);
        sm.game = gameMod.create({
           shipCountPer: art.hashPer,
           shipHPPer: art.wordPers[0],
           shipMoneyPer: art.wordPers[1]
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
        canvasMod.draw(layers, 'clear', 1);
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

        var canvas = layers[1].canvas;
        // draw money
        var dispText = { fillStyle: 'yellow', fontSize: 15};
        canvasMod.draw(layers, 'print', 1, Clucker.utils.formatNumber(sm.game.money), 10, canvas.height - 25, dispText);

        canvasMod.draw(layers, 'stateButtons', 2, sm);
    },
    events: {
        pointerStart: function(e, pos, sm){
            gameMod.clickAt(sm, pos);
        }
    }
});
// start the state machine
Clucker.start(sm);
