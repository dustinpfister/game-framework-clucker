Clucker.canvasMod.load({
    drawMethods: [
        // default 'pool-cc' draw method that will draw chicken and blast pools
        {
            name: 'pool-cc',
            method: function (stack, ctx, canvas, layerObj, sm) {
                Clucker.canvasMod.draw(stack, 'pool-sprite', 1, sm.game.chickens);
                Clucker.canvasMod.draw(stack, 'pool-solid', 1, sm.game.blasts, {
                    fillStyle: 'rgba(255, 255, 0, 0.5)'
                });
                // draw hp bars
                Clucker.poolMod.getActiveObjects(sm.game.chickens).forEach(function(chk){
                    if(chk.data.state != 'cooked' && chk.data.stat.hp != chk.data.stat.hpMax){
                        ctx.fillStyle = 'gray';
                        ctx.fillRect(chk.x, chk.y, 20, 5);
                        ctx.fillStyle = 'lime';
                        var hpPer = chk.data.stat.hp / chk.data.stat.hpMax;
                        if(hpPer <= 0.5){
                            ctx.fillStyle = 'orange';
                        }
                        if(hpPer <= 0.25){
                            ctx.fillStyle = 'red';
                        }
                        ctx.fillRect(chk.x, chk.y, 20 * ( chk.data.stat.hp / chk.data.stat.hpMax  ), 5);
                    }
                });
            }
        },
        // draw the swpan bar
        {
            name: 'spawn-bar',
            method: function (stack, ctx, canvas, layerObj, sm) {
                var w = 300;
                var x = canvas.width / 2 - w / 2;
                var per1 = 0,
                per2,
                per3;
                // main spawn bar
                ctx.fillStyle = 'gray';
                ctx.fillRect(x, 10, w, 25);
                per1 = sm.game.spawn.currentMaxActive / sm.game.spawn.maxActive;
                per2 = per1 / sm.game.spawn.currentMaxActive * sm.game.spawn.activeCount;
                ctx.fillStyle = 'white';
                ctx.fillRect(x, 10, w * per1, 25);
                ctx.fillStyle = 'lime';
                ctx.fillRect(x, 10, w * per2, 25);
                // next spawn bar
                per3 = sm.game.spawn.secs / sm.game.spawn.rate;
                ctx.fillStyle = 'blue';
                ctx.fillRect(x, 35, w * per3, 5);
            }
        },
        {
            name: 'fun-facts-guy',
            method: function (stack, ctx, canvas, layerObj, sm) {
                var talk = sm.funFacts.disp.talk;
                Clucker.canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.base, {});
                Clucker.canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.hair, {});
                Clucker.canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.mouth, {});
                Clucker.canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.hand, {}); 
                Clucker.canvasMod.draw(sm.layers, 'sprite', 1, talk, {});
                var lines = sm.funFacts.lines,
                len = lines.length,
                fontSize = 12,
                x = talk.x + talk.w / 2,
                y = talk.y + talk.h / 2 - fontSize * len / 2 - fontSize / 2;
                lines.forEach(function(line){
                    y += fontSize;
                    Clucker.canvasMod.draw(sm.layers, 'print', 1, line, x, y, {
                        align: 'center',
                        fontSize: fontSize
                    });
                });
                ctx.globalAlpha = 1;
            }
        },
        // info about the game
        {
            name: 'info',
            method: function (stack, ctx, canvas, layerObj, sm) {
                // printing info
                var printOptions = {
                    fontSize: 15
                };
                Clucker.canvasMod.draw(stack, 'print', 1, 'score : ' + sm.game.score, 10, 10, printOptions);
                Clucker.canvasMod.draw(stack, 'print', 1, 'cpm avg : ' + sm.game.cpm.avg, 10, 30, printOptions);
                var spawn = sm.game.spawn;
                Clucker.canvasMod.draw(stack, 'print', 1, 'active: ' + spawn.activeCount + '/' + spawn.currentMaxActive, 10, 50, printOptions);
                Clucker.canvasMod.draw(stack, 'print', 1, 'spawn rate: ' + spawn.rate.toFixed(2), 10, 70, printOptions);
                // fun facts info
                Clucker.canvasMod.draw(stack, 'print', 1, 'ff idle secs: ' + sm.funFacts.idleSecs.toFixed(2), 10, 90, printOptions);
                Clucker.canvasMod.draw(stack, 'print', 1, 'ff talk secs: ' + sm.funFacts.talkSecs.toFixed(2), 10, 110, printOptions);
		
            }
        }
    ]
});
