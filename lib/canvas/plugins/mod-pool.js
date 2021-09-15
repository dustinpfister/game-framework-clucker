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
        },
        // the newer 'pool-sprite method' that is designed to work with the stack.spriteSheets object
        // this method will look for a disp.data.sheetKey to know what sprite sheet to use
        // a disp.data.cellIndex will also be used to know what imgD like object in the cells array
        // of the spriteSheet object to use
        {
            name: 'pool-sprite',
            method: function(stack, ctx, canvas, layerObj, pool, opt){
                opt = opt || {};
                pool.objects.forEach(function(obj){
                    // sheet key
                    var sheetKey = opt.sheetKey || obj.data.sheetKey || 'default';
                    // cell index
                    var cellIndex = 0; // default cell index to 0
                    if(obj.data.cellIndex >= 0){ // if we have a cellIndex in disp.data use that
                        cellIndex = obj.data.cellIndex;
                    }
                    if(opt.cellIndex >= 0){ // opt object can be used to override all others
                        cellIndex = opt.cellIndex;
                    }
                    // get the sheet
                    var sheet = stack.spriteSheets[sheetKey];
                    // if we have a sheet use that
                    if(sheet){
                        if(obj.active || opt.drawAll){
                            var image = sheet.image;
                            var imgD = sheet.cells[cellIndex];

try{
                            ctx.drawImage(image, imgD.x, imgD.y, imgD.w, imgD.h, obj.x, obj.y, obj.w, obj.h);
}catch(e){

 utils.logOnce(cellIndex);

}
                        }                     
                    }else{
                        // if we fail to get a sheet use 'pool-solid'
                        canvasMod.draw(stack, 'pool-solid', layerObj.i, pool, opt);
                    }
                });
            }
        }
    ]
});