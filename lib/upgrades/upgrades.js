
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

    var getUpgradeMinor = function (upgradeObj) {
        var cost = '$' + upgradeObj.levelObj.forNext;
        return '(' + upgradeObj.levelObj.level + ')' + cost;
    };

    var buyUpgrade = function(sm, key){
        console.log('buying upgrade');
    };

    // create upgrades buttons helper
    var createUpgradeButtons = function (sm, upgradeKey, upgrades) {
        var state = sm.states[upgradeKey];
        Object.keys(upgrades).forEach(function (upgradeKey, i) {
            var upgradeObj = upgrades[upgradeKey];
            state.buttons['upgrade_' + upgradeKey] = {
                x: 32,
                y: 128 + (64 + 8) * i,
                w: 256,
                h: 64,
                upgradeKey: upgradeKey,
                desc: upgradeObj.desc,
                minor: getUpgradeMinor(upgradeObj),
                descSize: 20,
                onClick: function (e, pos, sm, button) {
                    //gameMod.buyUpgrade(sm, button.upgradeKey);
                    buyUpgrade(sm, button.upgradeKey);
                    button.minor = getUpgradeMinor(sm.game.upgrades[button.upgradeKey]);
                }
            };
        });
    };

    /********* ********** ********** ********** *********/
    // PUBLIC METHODS
    /********* ********** ********** ********** *********/

    // create and rerturn a state object
    api.createState = function (sm, opt) {
        opt = opt || {};
        opt.buttonLayer = opt.buttonLayer || 2;
        opt.upgradeStateKey = opt.upgradeStateKey || 'upgrades';
        opt.gameStateKey = opt.gameStateKey || 'game';
        opt.menuStateKey = opt.menuStateKey || 'menu';
        opt.update = opt.update || function () {};
        opt.upgradesPath = opt.upgradesPath || 'game.upgrades';
        var canvasWidth = sm.layers[0].canvas.width,
        canvasHeight = sm.layers[0].canvas.height;
        // return the state object
        var state = {
            name: opt.upgradeStateKey,
            buttons: {},
            start: function (sm, canvasMod) {
                var buttons = sm.stateObj.buttons = {};
                buttons['to_game'] = createToStateButton(opt.gameStateKey, canvasWidth - 64 - 16, 16, 'Game');
                buttons['game'] = createToStateButton(opt.menuStateKey, 16, 16, 'Back');

            },
            update: function (sm, secs) {
                // call opt update
                opt.update(sm, secs);
            },
            draw: function (sm, layers, canvasMod) {
                // clear
                canvasMod.draw(layers, 'clear', opt.buttonLayer);
                // buttons
                canvasMod.draw(layers, 'stateButtons', opt.buttonLayer, sm);
            }
        };
        return state;
    };

}
    (this['Clucker'] === undefined ? this['upgrades'] = {}
        : Clucker['upgrades'] = {}));
