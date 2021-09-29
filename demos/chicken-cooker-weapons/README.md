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

## The chickens now have hp bars

In previous chicken cooker demos chickens would just be cooked if in a blast area. Now they just take damage, and when there hp values reach zero that is when they are cooked.

## An init state, main menu state, stats state added in main.js

When it comes to the older chicken cooker demos thus far there was just a loading state and a game time state. In this demo I am now adding additional state objects in main.js that will allow for the beginnings of additional menus.


