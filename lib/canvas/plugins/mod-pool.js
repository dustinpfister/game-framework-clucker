canvasMod.load({
    drawMethods : [
        // basic draw a pool method
        {
            name: 'pool',
            method: function(stack, ctx, canvas, layerObj, pool, opt){
                opt = opt || {};
                pool.objects.forEach(function(obj){
                    // image data if any
                    var image = opt.image || obj.data.image || false,
                    imgD = opt.imgD || obj.data.imgD || {};
                    // style
                    ctx.fillStyle = opt.fillStyle || obj.data.fillStyle || 'white';
                    ctx.strokeStyle = opt.strokeStyle || obj.data.strokeStyle || 'black';
                    if(obj.active || opt.drawAll){
                        if(image){
                            ctx.drawImage(image, imgD.sx, imgD.sy, imgD.sw, imgD.sh, obj.x, obj.y, obj.w, obj.h);
                        }else{
                            ctx.beginPath();
                            ctx.rect(obj.x, obj.y, obj.w, obj.h);
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                });
            }
        }
    ]
});