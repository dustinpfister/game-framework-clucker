# chicken-cooker-weapons

This is yet another demo where I am continuing to build on top of what was once the original chicken cooker demo, which at this point I am just maintaining at its current state rather than adding features. The idea then is that I have some idea as to what the finished demo is when I first start working on it, and once I get to that point the only changes that should be made are to just make sure that the demo will continue to work with a late version of Clucker. However each time I start a new demo off of one of these demos, I can add features and this is one of those demos.

The progression thus far then is:

```
chicken-cooker => chicken-cooker-sheets
chicken-cooker-sheets => chicken-cooker-fun-facts
chicken-cooker-fun-facts => chicken-cooker-weapons
```

This time around as the name suggests I will be adding a few options when it comes to inflicting damage to the chickens. Speaking of damage I will also be adding hit point values to the chickens also of course. At this point I think I should add a number of other features while I am at it in an effort to continue turning this demo into something that is starting to look like a final product of some kind. Also I just need to keep working on demos like this for the sake of finding out what more needs to be integrated into the core of the framework.

## New features for chicken-cooker-weapons

So of course it should go without saying that more than one weapon is one of the features that will be added at this point. However each time I make a new chicken cooker demo of Clucker, I often add a few more features beyond just that of what the working name of the demo suggests. After all there is not just using weapons, there is also selecting which weapon to use while playing the game. There is also the idea of upgrading weapons, and buying supplies with weapons. So other features that I might want to add at this time would allow for additional menus that can be used to unlock and upgrade weapons.

### The player can now switch between at least two kinds of weapons thus far

many of the changes have to do with adding things to the game logic that allow for more than one kind of Weapon. previous demos of this chicken cooker game had just one weapon that would result in the expansion of an area called a blast, and any chickens in that area would end up being cooked.

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

## The chickens now have hp bars

In previous chicken cooker demos chickens would just be cooked if in a blast area. Now they just take damage, and when there hp values reach zero that is when they are cooked.

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

## An init state, main menu state, stats state added in main.js

When it comes to the older chicken cooker demos thus far there was just a loading state and a game time state. In this demo I am now adding additional state objects in main.js that will allow for the beginnings of additional menus.

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

## Cooked chicken type probability, prices, and total player money

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