canvasMod.load({
    drawMethods : [
        // default 'pool' draw method
        {
            name: 'pool',
            method: function(stack, ctx, canvas, layerObj, pool, opt){
                // what the default 'pool' method should be
                canvasMod.draw(stack, 'pool-imgd', layerObj.i, pool, opt);
            }
        },
        // a clean 'pool-solid' method that will just draw a solid color background
        // any image data that may or may not be in the display object will be ignored
        {
            name: 'pool-solid',
            method: function(stack, ctx, canvas, layerObj, pool, opt){
                opt = opt || {};
                pool.objects.forEach(function(obj){
                    // style
                    ctx.fillStyle = opt.fillStyle || obj.data.fillStyle || 'white';
                    ctx.strokeStyle = opt.strokeStyle || obj.data.strokeStyle || 'black';
                    if(obj.active || opt.drawAll){
                        ctx.beginPath();
                        ctx.rect(obj.x, obj.y, obj.w, obj.h);
                        ctx.fill();
                        ctx.stroke();
                    }
                });
            }
        },
        // the old 'pool-imgd' draw pool method that looks for an image ref and an 'imgD' object
        // in the options object, or the data object of a poolMod display object
        {
            name: 'pool-imgd',
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
                            ctx.drawImage(image, imgD.x, imgD.y, imgD.w, imgD.h, obj.x, obj.y, obj.w, obj.h);
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