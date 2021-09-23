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
        }
    ]
});
