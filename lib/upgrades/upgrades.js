
(function (api) {


    /********* ********** ********** ********** *********/
    //  
    /********* ********** ********** ********** *********/

    // create and rerturn a state object
    api.createState = function (sm, opt) {
        opt = opt || {};
        opt.buttonLayer = opt.buttonLayer || 1;
        return {
            name: 'upgrades',
            buttons: {
                to_game: createToGameButton(),
                back: createBackButton('mainMenu')
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

