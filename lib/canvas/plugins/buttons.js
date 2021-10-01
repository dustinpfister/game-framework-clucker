canvasMod.load({
    drawMethods : [
        // draw a button
        {
            name: 'button',
            method: function(stack, ctx, canvas, layerObj, button){
                var textOptions = {align: 'center', baseLine: 'middle', fontSize: button.descSize || 10 }, x, y;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.rect(button.x, button.y, button.w, button.h);
                ctx.fill();
                ctx.stroke();
                if(button.minor){
                    x = button.x + button.w / 2;
                    y = button.y + button.h / 3;
                    canvasMod.draw(stack, 'print', layerObj.i, button.desc, x, y, textOptions);
                    y += button.h / 3;
                    textOptions.fontSize = button.minorSize || 10;
                    canvasMod.draw(stack, 'print', layerObj.i, button.minor, x, y, textOptions);
                }else{
                    x = button.x + button.w / 2;
                    y = button.y + button.h / 2;
                    canvasMod.draw(stack, 'print', layerObj.i, button.desc, x, y, textOptions);
                }
            }
        },
        // draw a button collection for the current state object
        {
            name: 'stateButtons',
            method: function(stack, ctx, canvas, layerObj, sm){
                var state = sm.states[sm.currentState];
                Object.keys(state.buttons).forEach(function(buttonKey){
                    var button = state.buttons[buttonKey];
                    canvasMod.draw(stack, 'button', layerObj.i, button);
                });
            }
        }
    ]
});