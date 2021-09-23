canvasMod.load({
    drawMethods: [
        // default 'pool-cc' draw method that will draw chicken and blast pools
        {
            name: 'pool-cc',
            method: function (stack, ctx, canvas, layerObj, sm) {
                canvasMod.draw(stack, 'pool-sprite', 1, sm.game.chickens);
                canvasMod.draw(stack, 'pool-solid', 1, sm.game.blasts, {
                    fillStyle: 'rgba(255, 255, 0, 0.5)'
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
                canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.base, {});
                canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.hair, {});
                canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.mouth, {});
                canvasMod.draw(sm.layers, 'sprite', 1, sm.funFacts.disp.hand, {}); 
                canvasMod.draw(sm.layers, 'sprite', 1, talk, {});
                var lines = sm.funFacts.lines,
                len = lines.length,
                fontSize = 12,
                x = talk.x + talk.w / 2,
                y = talk.y + talk.h / 2 - fontSize * len / 2 - fontSize / 2;
                lines.forEach(function(line){
                    y += fontSize;
                    canvasMod.draw(sm.layers, 'print', 1, line, x, y, {
                        align: 'center',
                        fontSize: fontSize
                    });
                });
            }
        }
    ]
});
