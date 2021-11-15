Clucker.canvasMod.load({
    drawMethods: [
        // a single particle
        {
            name: 'part',
            method: function (stack, ctx, canvas, layerObj, obj, opt) {
                ctx.fillStyle = opt.fillStyle || obj.data.fillStyle || 'white';
                ctx.strokeStyle = opt.strokeStyle || obj.data.strokeStyle || 'black';
                if (obj.active || opt.drawAll) {
                    var x = obj.x + obj.w / 2,
                    y = obj.y + obj.h / 2;
                    if(obj.data.effect === 'mess'){
                        ctx.font = '10px arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(obj.data.mess, x, y);
                    }else{
                        ctx.beginPath();
                        ctx.arc(x, y,  (obj.w + obj.h) / 2 / 2 , 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
        },
        // a pool of particles
        {
            name: 'part-pool',
            method: function (stack, ctx, canvas, layerObj, pool, opt) {
                opt = opt || {};
                pool.objects.forEach(function (obj) {
                    Clucker.canvasMod.draw(stack, 'part', layerObj.i, obj, opt); 
                });
            }
        }
    ]
});
