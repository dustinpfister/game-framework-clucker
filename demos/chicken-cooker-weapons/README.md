# chicken-cooker-weapons

This is yet another demo where I am continuing to build on top of what was once the original chicken cooker demo, which at this point I am just maintaining at its current state rather than adding features. The idea then is that I have some idea as to what the finished demo is when I first start working on it, and once I get to that point the only changes that should be made are to just make sure that the demo will continue to work with a late version of Clucker as I continue to work on the framework. However each time I start a new demo off of one of these demos, I can add features and this is one of those demos.

The progression thus far then is:

```
chicken-cooker => chicken-cooker-sheets
chicken-cooker-sheets => chicken-cooker-fun-facts
chicken-cooker-fun-facts => chicken-cooker-weapons
```

This time around as the name suggests I will be adding a few options when it comes to inflicting damage to the chickens. Speaking of damage I will also be adding hit point values to the chickens also of course. At this point I think I should add a number of other features while I am at it in an effort to continue turning this demo into something that is starting to look like a final product of some kind. Also I want to have a better idea of what should be built into the framework itself, and what should remain part of a specific games logic.

So then some points about this demo over the others would be:

* The player can now choose between two or more weapons
* Chickens now have hit point values, they do not just cook when they are in a blast area but take damage
* Cooked chicken types now have differing probabilities of happening
* There is now a money value in place of score
* Various types of cooked chicken have various money values
* There is a main menu that can be used to enter other menus
* There is a stats menu that will be used to display various stats about the game
* There is an upgrade menu that can be used to buy upgrades
* Chickens now level up using the built in XP system of Clucker
* When chickens level up the max hp values will go up
* A working upgrade for reducing hpMax as chickens level up
* A working upgrade for cooked chicken values

I am still working on this one as of this writing so some additional things are planed:

* working weapons upgrades

## New features and changes to clucker while working on chicken-cooker-weapons

I just need to keep working on demos like this for the sake of finding out what more needs to be integrated into the core of the framework. As there is still a great deal of basic stuff that is missing that I think a game framework should have. Anyway in this section I will be going over some of the features and changes made to Clucker that where a result of working on this demo. When I started with this one I was using Clucker 0.5.25. As of the last time I updated this readme I was using 0.6.2, and this is still an active demo that I intended to keep working on until I have a few additional features added for the demo, as well as of course Clucker itself before moving on to the next demo.

### Various bugs fixed, and improvements made with the Clucker built in loader ( 0.6.2 )

In the state machine module of clucker I have a built in loader state that I am using to load just images for now. However I have found that there where a few problems with it that have been resolved. The progress bar would not move when I simulated a slow Internet collection which is of course a major problem for a loader. This was resolved by making the code that is used in the update method set a value in a new data object for a state object that is then what is used to draw and update text in the draw method of the loader state object.

```js
    // update data.loaded value
    var data = sm.states.loader.data;
    var loaded = data.loaded = sm.layers.images.reduce(function (acc, el) {
        return el === undefined ? acc : acc + 1;
    }, 0);
    // if loaded === total count of images change state to start state of the sm.loader object
    if (loaded === sm.loader.images.count) {
        Clucker.gameFrame.smSetState(sm, sm.loader.startState || 'game');
    }
```

### Fixed a Bug with the XP system in utils ( 0.5.32 )

When using the XP system for the first time when working out some upgrades for this demo I found a bug in the XP System of the utils module. The cause of the bug was just a few careless mistakes when calling some internal methods, and not passing a delta next value when doing so.

```js
// Basic experience point system methods
utils.XP = (function () {
    // default values
    var default_deltaNext = 50,
    defualt_cap = 100;
    // get level with given xp
    var getLevel = function (xp, deltaNext) {
        deltaNext = deltaNext === undefined ? default_deltaNext : deltaNext;
        return (1 + Math.sqrt(1 + 8 * xp / deltaNext)) / 2;
    };
    // get exp to the given level with given current_level and xp
    var getXP = function (level, deltaNext) {
        deltaNext = deltaNext === undefined ? default_deltaNext : deltaNext;
        return ((Math.pow(level, 2) - level) * deltaNext) / 2;
    };
    // parse a levelObj by XP
    var parseByXP = function (xp, cap, deltaNext) {
        //cap = cap === undefined ? default_cap : cap;
        var l = getLevel(xp, deltaNext);
        l = l > cap ? cap : l;
        var level = Math.floor(l),
        forNext = getXP(level + 1, deltaNext);
        return {
            level: level,
            levelFrac: l,
            per: l % 1,
            xp: xp,
            forNext: l === cap ? Infinity : forNext,
            toNext: l === cap ? Infinity : forNext - xp
        };
    };
    return {
        // use getXP method and then pass that to parseXP for utils.XP.parseByLevel
        parseByLevel: function (l, cap, deltaNext) {
            return parseByXP(getXP(l, deltaNext), cap, deltaNext);
        },
        // can just directly use parseByXP for utils.XP.parseByXP
        parseByXP: parseByXP
    };
}
    ());
```

### Format number utils method ( 0.5.31 )

While I was fixing the bug I thought I should also expand the utils module with some additional methods including one that can be used to format a number that is a money value.

```js
// format money method
utils.formatNumber = function(number){
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0 // (causes 2500.99 to be printed as $2,501)
    });
    return formatter.format(number); /* $2,500.00 */
};
```

### Deep Clone and traverse methods ( 0.5.31 )

On top of the format number method I also added some object methods for deep cloning and traversing an object.

```js
// traverse an object
utils.traverse = function (obj, forKey, level) {
    level = level || 1;
    for (var i in obj) {
        // call forKey for every key found
        forKey.call(obj[i], obj[i], i, typeof obj[i], level, obj);
        // call utils.traverse recursively if type is object and not null
        if (typeof obj[i] === 'object' && obj[i] != null) {
            nextLevel = level + 1;
            utils.traverse(obj[i], forKey, nextLevel);
        }
    }
    return null;
};
```

## New features for chicken-cooker-weapons

So of course it should go without saying that more than one weapon choice is one of the changes, however there is much more than has changed. After all there is not just using weapons, there is also selecting which weapon to use while playing the game so some changes have been made when it comes to the user interface. This means additional states beyond just the loading state, and game time state, and buttons have been added not just for cycling weapons but also entering other states. Many more changes have been made when it comes to the various types of cooked chicken, money over score, and other various additions and changes outline here.

### The player can now switch between at least two kinds of weapons thus far

Previous demos of this chicken cooker game had just one weapon that would result in the expansion of an area called a blast, and any chickens in that area would end up being cooked. With the new system I now have a collection of weapons in the cc-game.js file that outline some properties for what is thus far just two options for weapons.

```js
    var WEAPONS = {
        frying_pan: {
            key: 'frying_pan',
            blastType: 'singleHit',
            maxBlastRadius: 8,
            damage: [2, 7]
        },
        rocket: {
            key: 'rocket',
            blastType: 'explosion',
            maxBlastRadius: 225,
            damage: [2, 9]
        }
    };
```

### The chickens now have hp bars

In previous chicken cooker demos chickens would just be cooked if in a blast area. Now they just take damage, and when there hp values reach zero that is when they are cooked. So a display object of a chicken in the chickens object pool now has a stat object in the data object of the display object of a chicken. This stat object for now contains hit points, max hit points, and additional values that have to do with auto heal rate.

```js
    // set up a chicken object for the first time
    var setupChicken = function (obj, sm) {
        var d = obj.data;
        d.sheetKey = 'chick-walk';
        d.cellIndex = 0;
        d.imageIndex = Math.floor(Math.random() * 2);
        d.stat = {
            hp: 10,
            hpMax: 10,
            recovery: 1.5,
            autoHealRate: 10,
            autoHealPer: 0.1
        };
        d.autoHealSecs = 0;
        d.godMode = false;
        d.godModeSecs = d.stat.recovery;
    };
```

### Chickens now level up

The chickens will now level up as the score value goes up.

```js
    // set chicken level
    var setChickLevel = function (game) {
        game.chickLevel = Clucker.utils.XP.parseByXP(game.score, 100, 75);
    };
```

### An init state, main menu state, stats state added in main.js

When it comes to the older chicken cooker demos thus far there was just a loading state and a game time state. Once all the assets load the game would just jump to the game time state and that is it. In this demo I am now adding additional state objects in main.js that will allow for the beginnings of additional menus. Because the game and progress from once state back to the game time state I also added an init state that will be called just once after the loading state.

```js
// simple init state that will just be called once after load state
Clucker.gameFrame.smPushState(sm, {
    name: 'init',
    start: function (sm, canvasMod) {
        // set button desc for first time
        sm.states.gameTime.buttons.weapon.desc = sm.game.currentWeapon;
        // create sm.funFacts
        sm.funFacts = funFactsMod.create(sm);
        // create chicken sprite sheets
        var size = sm.CHICKENS_CELL_SIZE;
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-walk', [4, 6], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-rest', [5, 7], size, size);
        canvasMod.createSpriteSheetGrid(sm.layers, 'chick-cooked', 1, size, size);
        // create fun facts sheets
        funFactsMod.createSheets(sm, [2, 3]);
        // background
        sm.layers.background = sm.layers.images[0];
        canvasMod.draw(sm.layers, 'background', 0);
        Clucker.gameFrame.smSetState(sm, 'gameTime');
    }
});
```

### Cooked chicken type probability, prices, and total player money

Up until now the game was just about racking up a simple score where each chicken was worth just one point. Now the situation has changed where we are talking about a money value, and each type of cooked chicken is worth a certain amount of money. On top of that the system used to be that it was just an equally random selection when it comes to the various types, so changes where made so that points values can be set for each cooked chicken type which in turn will effect the percentage chance of that kind of cooked chicken occurring.


```js
    // cooked Types
    var COOKED_TYPES = [
        {
            desc: 'Drumstick',
            points: 70,
            price: 1
        },
        {
            desc: 'Rotisserie',
            points: 20,
            price: 2
        },
        {
            desc: 'Sandwich',
            points: 8,
            price: 6
        },
        {
            desc: 'Over Rice',
            points: 2,
            price: 15
        }
    ];
```

```js
    // set cooked chicken per values
    var setCookedChickenPerValues = function(game){
        var totalPoints = game.COOKED_TYPES.reduce(function(acc, obj){
            return acc + obj.points || 0;
        }, 0);
        game.COOKED_TYPES = game.COOKED_TYPES.map(function(obj){
            obj.per = obj.points / totalPoints;
            return obj;
        });
    };
    // get cooked chicken index
    var getCookedChickenIndex = function(game){
        var roll = Math.random(),
        i = 0,
        per = 0,
        len = game.COOKED_TYPES.length;
        while(i < len - 1){
             per += game.COOKED_TYPES[i].per;
             if(roll < per){
                 break;
             }
             i += 1;
        }
        return i; //Math.floor(Math.random() * 4);
    };
```

### Upgrades state, and create upgrade buttons

On top of weapons I have also started working on an upgrade state, and other various things to have such a system.

```js
// create upgrade buttons
var createUpgradeButtons = function(sm, upgradeKey, upgrades){
    var state = sm.states[upgradeKey];
    Object.keys(upgrades).forEach(function(upgradeKey, i){
        var upgradeObj = upgrades[upgradeKey];
        state.buttons['upgrade_' + upgradeKey] = {
            x: 32 + (128 + 32) * i,
            y: 128,
            w: 128,
            h: 64,
            upgradeKey: upgradeKey, 
            desc: upgradeObj.desc,
            onClick: function (e, pos, sm, button) {
                var upgrade = sm.game.upgrades[button.upgradeKey];
                console.log(upgrade.levelObj);
            }
        };
    });
};
```