
(function (api) {

    // create to state button helper
    var createToStateButton = function (toState, x, y, desc, w, h) {
        return {
            x: x === undefined ? 0 : x,
            y: y === undefined ? 0 : y,
            w: w === undefined ? 64 : w,
            h: h === undefined ? 64 : h,
            desc: desc || 'Back',
            onClick: function (e, pos, sm, button) {
                Clucker.gameFrame.smSetState(sm, toState);
            }
        }
    };

    var getUpgradeMinor = function (upgradeObj) {
        var cost = '$' + upgradeObj.levelObj.forNext;
        return '(' + upgradeObj.levelObj.level + ') ' + cost;
    };

    // get upgrades helper
    var getUpgrades = function(sm, str){
        var keys = str.split('.'),
        ref = sm;
        while(keys.length > 0){
            var k = keys.shift();
            ref = ref[k];
        }
        return ref;
    };

    var applyUpgradesToState = function (sm, data) {
        var upgrades = getUpgrades(sm, data.upgradesPath);
        Object.keys(upgrades).forEach(function (key) {
            var upgrade = upgrades[key];
            upgrade.applyToState.call(sm, sm, upgrade, upgrade.levelObj.level);
        });
    };

    var buyUpgrade = function(sm, data, key){
        console.log('buying upgrade');
        var upgrades = getUpgrades(sm, data.upgradesPath),
        upgrade = upgrades[key];
        if(data.onBuyUpgrade(sm, upgrade)){
            var newLevel = upgrade.levelObj.level + 1;
            upgrade.levelObj = Clucker.utils.XP.parseByLevel(newLevel, upgrade.cap, upgrade.deltaNext);
            applyUpgradesToState(sm, data);
        }

/*
        var upgrade = game.upgrades[key];
        if (game.money >= upgrade.levelObj.forNext) {
            game.money -= upgrade.levelObj.forNext;
            var newLevel = upgrade.levelObj.level + 1;
            upgrade.levelObj = Clucker.utils.XP.parseByLevel(newLevel, upgrade.cap, upgrade.deltaNext);
        }
        applyUpgradesToState(game, sm);
*/

    };

    // create upgrades buttons helper
    var createUpgradeButtons = function (sm, data, upgrades) {
        var state = sm.states[data.upgradeStateKey];
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
                    buyUpgrade(sm, data, button.upgradeKey);
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
        opt.onBuyUpgrade = opt.onBuyUpgrade || function(sm, upgrade){
            return true;
        }
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
                var upgrades = getUpgrades(sm, opt.upgradesPath);
                createUpgradeButtons(sm, opt, upgrades);
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
