
(function (api) {


    var createToStateButton = function (toState, x, y, desc) {
        return {
            x: x,
            y: y,
            w: 64,
            h: 64,
            desc: desc || 'Back',
            onClick: function (e, pos, sm, button) {
                Clucker.gameFrame.smSetState(sm, toState);
            }
        }
    };


    /********* ********** ********** ********** *********/
    //  
    /********* ********** ********** ********** *********/

    // create and rerturn a state object
    api.createState = function (sm, opt) {
        opt = opt || {};
        opt.buttonLayer = opt.buttonLayer || 2;
        opt.gameStateKey = opt.gameStateKey || 'gameTime';
        opt.menuStateKey = opt.menuStateKey || 'mainMenu';
        return {
            name: 'upgrades',
            buttons: {
                to_game: createToStateButton(opt.gameStateKey, canvasWidth - 64 - 16, 16, 'Game'), //createToGameButton(),
                back: createToStateButton(opt.menuStateKey, canvasWidth - 64 - 16, 16, 'Game')
            },
            start: function (sm, canvasMod) {},
            update: function (sm, secs) {},
            draw: function (sm, layers, canvasMod) {
                // clear
                canvasMod.draw(layers, 'clear', opt.buttonLayer);
                // buttons
                canvasMod.draw(layers, 'stateButtons', opt.buttonLayer, sm);
            }
        };
    };

}(this['Clucker'] === undefined ? this['upgrades'] = {} : Clucker['upgrades'] = {}));

