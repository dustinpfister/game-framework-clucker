# game-framework-clucker todo list

<!-- ########## ########## -->
## 0.8.x - Grid Module
<!-- ########## ########## -->

### (  ) - 0.8.1 - Path detection
* add a path detection feature for the grid module
* start a grid-path-detection demo

### (  ) - 0.8.0 - Starting Grid Module
* Start a new grid module for clucker.js
* Start a grid-basic demo


* optional modules (/js):

/js/grid-core/grid.js
* start a new grid module

/js/screen-shake/screen-shake.js
* start a stand alone module for the screen shake feature that I have made for header-app.

/js/standard-states/saves-menu/save-menu.js:
* started a new nested folder in the /js folder called 'standard-states' 
* a standard state project will create and return state objects that can be used in final game projects
* start out with a 'save-menu' standard-states project for quickly createing a save state menu for a game

* Demos (/demos):

    /demos/header-app-green-world
    * using header-app as a quide start a all new header-app that will involve a 2d map
    * use new grid module for this


<!-- ########## ########## -->
## 0.7.x - Storage.js started
<!-- ########## ########## -->

### (  ) - 0.7.1 - header-app content map, effect pools, root js folder

* Clucker Core (/lib): 

    /lib/canvas/plugins/mod-pool.jd
    * (done) new circle, and pool-circles methods
    * (done) new 0.7.1 build for Clucker and use it for header-app
    * (done) use new Clucker built in getDistanceToObj method

    /lib/gameframe/grameframe.js
    * (done) change background color of built in image loader
    * (done) have a new progress bar design for the built in loader
    * (done) added an option for smCreateMain that allows for setting a custom class name for layers when creating the main sm object

    /lib/object-pool:
    * (done) make getDistanceToObj method in header-app part of the objectPool library
    * (done) use new getDistanceToObj method in header-app gameMod
    * (done) use new getDistanceToObj method in shot-homing.js

    /lib/canvas/plugins/buttons.js
    * (done) button draw method looks for an imageIndex in button object and in the event there is one uses that in place of ctx.rect
    * (done) button.imageStats object for buttons

    /lib/canvas/canvas.js
    * (done) option for canvasMod.createLayerStack that can be be used to set the className for all layer dom elements

* Optional Modules (/js):

    /js/shot-homing/
    * (done) start a stand alone module for creating a shot pool with homing features starting with shot.js
    * (done) shotMod.createPool method that will create and return an Object pool for shots
    * (done) use shotMod.createPool in the game.js of header-app
    * (done) shot.data.homing object with target and active props
    * (done) have a homingUpdate helper that will adjust angle based on target position
    * (done) fix the issue with having a UNIT SIZE const in shot-homing.js

    /js/article:
    * (done) make the article.js file from header-app be its own thing in the new js folder
    * (done) have header-app use the article.js at the new /js folder location
    * (done) have a single 'pageQuality' index value on a 0 to 1 scale based on just word count for now

    /js/particles:
    * (done) make the particles.js file from header-app be its own thing in the new js folder
    * (done) new mess EFFECT that can be used to display a message like 'EVADE', 'CRIT HIT', as well as damage and money amounts
    * (done) new canvas plug in for particles.js

* Demos (/demos):

    /demos/header-app: 
    * (done) make art system for making a grid with values that are effected by page content
    * (done) use grid of values to set positions of units
    * (done) start a /demos/header-app/lib/particles.js file to be used to create explosion and particles pools
    * (done) have a particles pool to be used for ship deaths and shot hits
    * (done) can set a Degrees Per Second value for a particle
    * (done) particle alpha effect
    * (done) have an EFFECTS object that will contain a number of functions that are used for the particlesMod.spawn method
    * (done) game state save on each ship death
    * (done) screen shake method in main.js
    * (done) can set what layers to shake
    * (done) see about adding a light layer that will be a current amount of ambient light
    * (done) have ship deaths effect ambient light
    * (done) explosions for shots
    * (done) maxSize option for parts
    * (done) ships have an evade stat value
    * (done) when a ship is hit a roll is compared to evadePer, and if roll is lower, the ship does not take damage
    * (done) start a sheet for buttons, and have a pause button cell
    * (done) have a sheet for units with rest and fire animation
    * (done) see about fixing bug with unit doors
    * (done) have more than one page with differing states of content, and update the nav bar up top
    * (done) have a page-zero.html file that is a page with no content to test what happens when header-app runs on a page like that
    * (done) have a total kills count as part of the display
    * (done) save kill count as part of game save state
    * (done) have a single 'pageQuality' index value on a 0 to 1 scale based on just word count for now
    * (done) have all values such as ship count, unit count and so forth be based on this single 'pageQuality' value
    * (done) rangeByPer helper that will return a number given a 0-1 value with a min and max as arguments
    * (done) SHIP-COUNT-MIN and using rangeByPer helper for ship count
    * (done) UNIT-COUNT-MIN and using rangeByPer helper for unit count
    * (done) display a pageQuality bar as part of the bottom display
    * (done) pageQuality bar label
    * (done) add a 5.png that wil be used to skin shots
    * (done) have a shot sheet and use shot sheet with shots
    * (done) animate shot sheet
    * (done) have an addtional page-long.html file that will have a word count that is the high.
    * (done) set custom header-app-layer className using new canvasMod prop
    * (done) use rangeByPer helper for all relavent values for ships and units
    * (done) new const value for unit cell fps

* TODO: Demos (/demos)

    /lib/utils/
    * utils.valueByRange based off of rangeByPer helper

    /demos/header-app/
    * have a lib/ships.js file to be used in game.js
    * use Clucker.utils.valueByRange in ships.js
    * have a lib/units.js file to be used in game.js
    * with page quality display: units: 4/10, ships: 8/30, shipMoney: $8-$20 
    * the display for the logo layer and all layers needs to be reactive when changing the size of the window
    * adjust death explosion so that it is centered with the ship sprite

    /demos/header-app-space-war
    * start out with header-app source to create new project bassed off of that
    * do away with random positioning of units in the event of zero page content in favor of a set pattern for units
    * new units.js file
    * two unit types 0-blaster, and 1-silo (old unit from header-app)

* TODO: Root (/)
    * update README.md to reflect Clucker 0.7.1

### ( done 11/03/2021 ) - 0.7.0 - save state system, new storage demo, header-app
* (done) start a save state system as a new lib called storage.js
* (done) start out with just localStorage as a means to store save states
* (done) start a new storage demo for this new feature
* (done) the storage demo can just be some very simple game that is just purging blocks
* (done) step a score each time a block is purged
* (done) use new storage module to save the game state in terms of the score
* (done) make sm.appName a standard sm prop for a main state machine object in gameframe.js
* (done) JSON.stringify and JSON.parse should be done in storage.js
* (done) have gameframe.start and gameframe.stop methods
* (done) header-app: start a article.js lib for taking into account the content of a page 
* (done) gameframe.js: currentState of an sm object should be set to 'loader' if built in loader is being used
* (done) mod-pool.js: passing option object when calling 'pool-sprite' draw method
* (done) mod-pool.js: fixed an isshue with backup drawing with 'pool-sprite' draw method
* (done) mod-pool.js: add a new 'solid' draw method to be used with 'pool-solid' and 'pool-sprite' draw methods
* (done) header-app: have a sprite sheet for the ships
* (done) header-app: have ships move in fixed number of directions
* (done) header-app: ships have hit points
* (done) mod-pool.js: 'sprite' draw method now supports the use of a draw method called after sprite image
* (done) header-app: use new draw method option of 'sprite' draw method to draw hp bars for ships
* (done) header-app: art stats have an impact on state.hpMax
* (done) header-app: have a display that will show a money figure
* (done) header-app: have a stat.money value that will be added to game.money when the ship is destroyed
* (done) header-app: the art stats have an impact on state.money
* (done) header-app: use the new storage system to save the money value
* (done) header-app: have ships spawn out of bounds, rather than at the center
* (done) header-app: have a shots pool, and a units pool
* (done) header-app: first unit is a gun that will fire shots at ships
* (done) header-app: shots do damage to ships
* (done) header-app: have units fire at ships rather than randomly
* (done) header-app: have a unit range stat
* (done) header-app: shots will purge when they reach max distance
* (done) header-app: start a new get shoot angle angle demo in the header app folder
* (done) header-app: new draft folder that has a demo that has to do with 'shooting where a ship will be'
* (done) header-app: start a new shot.js file that will contain helper methods for shots
* (done) header-app: make code in get shoot at angle draft be part of the shots lib
* (done) header-app: use the shot.js file to get shoot at angles
* (done) header-app: display a circle around units that shows range
* (done) header-app: make unit count a factor that is effected by art stats
* (done) header-app: ship speed per
* (done) header-app: make unit range a factor that is effected by art stats
* (done) header-app: make unit shot speed a stat, and make that effected by art stats

<!-- ########## ########## -->
## 0.6.x - Starting an upgrades module for clucker
<!-- ########## ########## -->

### ( done 10/23/2021 ) - 0.6.3 - starting a new header-app demo collection
* (done) start a new header-app demo that will be a start for the kind of project to place in the header of a website
* (done) make sure all demos are working with at least 0.6.2
* (done) have an object pool of little ships that move around in the canvas and wrap around when they go out of bounds
* (done) random headings and speeds when spawning
* (done) have a spawn rate
* (done) clicking on one will cause it to purge.
* (done) make applyUpgradesToState a public method of the upgrades module
* (done) have chicken-cooker-weapons be the first demo to use 0.6.3 of clucker
* (done) createToState button should be a public method if gameframe.js
* (done) work out a simple pause button for header-app
* (done) start an images folder for header-app starting with a background as 0.png and overlay image as 1.png
* (done) use the loader feature to load images
* (done) display the background, and overlay images


## ( done 10/12/2021 ) - 0.6.2 - upgrades module: create upgrades method
* (done) have a new end hook for the built in loader state
* (done) new sm.stateObj prop that is a ref to the current state object
* (done) fix issue with loader where progress bar is not updating
* (done) make a data object of a state object standard
* (done) use the data object as a way to update a stateObj.data.loaded value for the built in loader
* (done) start using 0.6.2 with chicken-cooker-weapons
* (done) create upgrade buttons for upgrade-builtin
* (done) the built in buttons will look for an sm.game.upgrades collection by default
* (done) have a getUpgrades helper that will get the upgrades object from a path such as 'game.upgrades'
* (done) have an onBuyUpgrade method option that will be used to set how to deduct money, or any other resource

## ( done 10/05/2021 ) - 0.6.1 - Clucker.upgrades : create state method
* (done) use the game.multipliers prop for the cooked chicken value upgrade
* (done) maybe multipliers, and other effect values should be part of the upgrade object as upgrade.value
* (done) if we are now using values in upgrade objects, then remove the old game.multipliers prop
* (done) have a main setChickenStats helper that will call a method for each chicken state effected by chick level
* (done) use the Clucker upgrades create state method with chicken-cooker-weapons
* (done) have an update option for the upgrades create state method

## ( done 10/02/2021 ) - 0.6.0 - New features for Buttons
* (done) make changes to buttons.js canvas plugin to allow for drawing minor text value in the button
* (done) have control over font size of desc and minor
* (done) use new minor text value to display price of an upgrade, and the current level over max in chicken-cooker-weapons
* (done) have a game.chickLevel property
* (done) chickens level up with game.score value
* (done) have it so that game.chickLevel is used set set stats each time a chicken spawns
* (done) get the chick hp reduction upgrade working
* (done) start a new Clucker.upgrades module to help set up an upgrades state for a game

<!-- ########## ########## -->
## 0.5.x - Image Array and SpriteSheets
<!-- ########## ########## -->

## ( done 10/01/2021 ) - 0.5.32 - chicken-cooker-weapons: Global Cooked Chicken value working
* (done) Make the current level part of the desc of the button
* (done) can not set an amount of starting money by gameMod.create method option
* (done) fix bug with forNext prop of XP system for new 0.5.32 build
* (done) new UPGRADES Const in gameMod
* (done) use a gameMod.buyUpgrade method for the onclick method of an upgrade button
* (done) have an applyToState method for each upgrade object
* (done) get the Global Cooked Chicken value upgrade working

## ( done 09/30/2021 ) - 0.5.31 - chicken-cooker-weapons: upgrades menu strated
* (done) Start an upgrades menu
* (done) The colection of upgrades needs to be part of gameMod
* (done) fix bug with xp system
* (done) while I am at it I added utils.deepClone, utils.traverse, and utils.formatNumber methods to new 0.5.31 build
* (done) I will need a game.upgrades propery that will be used to render upgrades in the upgrades menu
* (done) Use the XP system in utils to figure out prices
* (done) Create Buttons for upgrades helper in main.js
* (done) Start with a Global Cooked Chicken value upgrade, and chick hp reduction

## ( done 09/29/2021 ) - 0.5.30 - chicken-cooker-weapons: new system for 'cooked' chickens
* (done) I am going to want a COOKED-TYPES const in cc-game.js
* (done) set up game.stats.cookedTypes array to zeros for length of COOKED_TYPES in gameMod.create
* (done) have Display names for objects in COOKED-TYPES
* (done) start a getCookedTypeIndex helper to be used in blast update method
* (done) have a roll local variable in getCookedTypeIndex that wil be used to find the cooked type index
* (done) have points values for each object in COOKED-TYPES this is what will be used to find per values for each
* (done) have a setCookedTypePerValues helper 
* (done) various probabilities for various types of cooked chicken
* (done) have to so that the various types of cooked chickens have various prices
* (done) display money

## ( done 09/29/2021 ) - 0.5.29 - chicken-cooker-weapons: Menus
* (done) change the way chickens are looped over in blasts update so that the loop can be broken for singleHit blasts
* (done) have an stat.autoHealRate and stat.autoHealPer prop for chickens
* (done) do not display health bars for chickens that have full health
* (done) have color coded hp bars
* (done) have an menu button in the top right corner of the canvas
* (done) clicking the menu button will cause the game to enter a main menu
* (done) have a stats menu for now on top of main menu
* (done) from the main menu the player can progress to other menus such as the stats menu
* (done) both stats and options menus should have a button for returning back to the game.
* (done) have a game.stats.cookedTypes array that will be a count for each cooked chicken type
* (done) display counts of game.stats.cookedTypes array in stats state

## ( done 09/28/2021 ) - 0.5.28 - chicken-cooker-weapons: 'frying-pan', and 'rocket' weapons
* (done) I will need to start a weapons object in cc-game.js
* (done) have the current attack be a 'rocket' type weapon
* (done) start a frying-pan weapon that is just a single target attack weapon
* (done) have a weapon selection button that can be used to switch between the two weapons
* (done) display name of weapon in weapon button
* (done) have a game.holdFire bool that can be used to make it so the current weapon will not fire after clicking weapon button

## ( done 09/27/2021 ) - 0.5.27 - new chicken-cooker-weapons demo
* (done) start a new chicken-cooker-weapons demo based off of chicken-cooker-fun-facts
* (done) make it so that chicken display objects have a stat object
* (done) this stat object contains hp, and hpMax properties
* (done) chickens should have small hp bars
* (done) use the distance from the center of a blast to find out how much damage to hit a chicken with
* (done) chickens should have a stat.recovery prop that is the amount of time in secs that can pass until the chick can get hit again
* (done) adjust alpha value of chickens while in godMode

## ( done 09/26/2021 ) - 0.5.26 - Better Points demo
* (done) have a target points array
* (done) move current points location to target points location
* (done) start a README for the points demo

## ( done 09/26/2021 ) - 0.5.25 - utils.wrapText
* (done) update chicken-cooker to use least 0.5.24
* (done) need to change references to gameFrame to Clucker.gameFrame for the built in loader in gameframe.js
* (done) update chicken-cooker-fun-facts to use 0.5.25+
* (done) update chicken-cooker-sheets to use 0.5.25+
* (done) update loader to use 0.5.25+
* (done) update menus to use 0.5.25+
* (done) update points to use 0.5.25+
* (done) update spritesheet to use 0.5.25+
* (done) update spritesheet-ships to use 0.5.25+
* (done) create a utils.wrapText method based off of what I have for chicken-cooker-fun-facts
* (done) have chicken-cooker-fun-facts use new utils.wrapText method in 0.5.25
* (done) fix problem where I still have a poolMod global for some reason

## ( done 09/25/2021 ) - 0.5.24 - Clucker methods
* (done) - I will want a Clucker.createMain method
* (done) - I will want a Clucker.pushState method
* (done) - I will want a Clucker.setState method
* (done) pass canvasMod as argument for draw methods, and start methods of states

## ( done 09/25/2021 ) - 0.5.23 - start a nodejs build tool that creates a dist folder
* (done) in the nodejs folder start a build tool
* (done) the built tool should create a /dist/0.5.23/clucker.js from files in /lib
* (done) the built tool should create a /dist/0.5.23/clucker.min.js from files in /lib
* (done) clucker.js should create just one global token called Clucker
* (done) update hello world demo to use Clucker 0.5.23
* (done) There should be a Clucker.ver prop that is the current version of Clucker

## ( done 09/23/2021 ) - 0.5.22 - chicken-cooker-fun-facts: CPM Trigger
* (done) start a CPM trigger that will trigger for certain CPM Rates
* (done) I will need a funFacts.bestCPM value to use to know if the trigger should go active or not
* (done) so the activeCondition is when the CPM goes above a figure like 50, 100, 200, ect
* (done) set funFacts.bestCPM back to 0 when game object cpm avg is 0
* (done) have one or more says for each CPM

## ( done 09/23/2021 ) - 0.5.21 - chicken-cooker-fun-facts: New Trigger standard
* (done) rename condition prop of a trigger to activeCondition
* (done) have a leaveCondition function for a trigger
* (done) have it so that any kind of user input will be the leaveCondition for the idle trigger
* (done) have more than one say for idle trigger
* (done) have an init method for a trigger
* (done) have an update method for a trigger
* (done) have a done method for a trigger

## ( done 09/23/2021 ) - 0.5.20 - chicken-cooker-fun-facts: draw.js
* (done) start a draw.js for chicken-cooker-fun-facts that will be a canvas plugin
* (done) have a funfacts draw method
* (done) have a info draw method
* (done) have a spawnBar draw method
* (done) have a pools draw method

## ( done 09/23/2021 ) - 0.5.19 - chicken-cooker-fun-facts: mouth, and hand disp object
* (done) update 3.png sheet of fun facts guy to include hand and mouth cells
* (done) finish working out what the cells are for the sprite sheet object.
* (done) start a mouth disp object for the fun facts guy
* (done) start a hand disp object for the fun facts guy
* (done) animate the mouth
* (done) animate the hand

## ( done 09/22/2021 ) - 0.5.18 - chicken-cooker-fun-facts: triggers, and first words
* (done) start a system for triggers that will cause the guy to show up
* (done) have an inactivity trigger

## ( done 09/21/2021 ) - 0.5.17 - chicken-cooker-fun-facts: draw fun facts guy
* (done) I will need a 'funfacts-guy' sheet work out things just for the base image first
* (done) start with a funFacts.disp.base object that will be for the base image
* (done) I will want to have a funfacts.x and funFacts.y values that will be used to set the posiiton of all other dispay objects
* (done) I will want a setDispPositons helper that will set the x and y positons of all disp objects realtive to funFacts.x and funFacts.y
* (done) have it so that the guy slides in from the left to the right
* (done) after a set delay the guy will no longer be active and will move out of the canvas
* (done) for now have it so that he just shows up every few seconds

## ( done 09/20/2021 ) - 0.5.16 - start chicken-cooker-fun-facts
* (done) start a chicken cooker fun facts demo based off of chicken-cooker-sheets
* (done) work out a new img/cc-fun-facts skin based on img/ccsheets.
* (done) 2.png will need to be the talk bubble image
* (done) 3.png will need to be an image sheet for a 'fun-facts' guy
* (done) bump down the other images
* (done) I am thinking I should maybe start a local lib folder for game.js, and now a new fun-facts.js
* (done) funFactsMod should be used in main.js, try to keep from making this part of game.js
* (done) I will need a stand alone 'sprite' draw method in mod-pool.js
* (done) see about drawing a funFacts.obj.talk disp object using the 'funfacts-talk' sprite sheet

## ( done 09/20/2021 ) - 0.5.15 - more sm object constants for CPM and other values
* (done) have a sm.CPM_DSECS, and sm.CPM_MAX_SAMPLES and use them in the CPMupdate helper in game.js
* (done) have a sm.CHICKEN_COOKED_DELAY constant and use it in the blast pool update method
* (done) have a sm.MAX_ACTIVE_CPM const and use it in the maxActiveUpdate helper
* (done) add changes to pool-sprite draw method to allow for setting global alpha by way of disp.data.alpha

## ( done 09/20/2021 ) - 0.5.14 - chicken-cooker-sheets variable spawn rate, and span rate bar
* (done) have a blue spawn rate bar below the main spawn rate bar
* (done) in the event that current active chickens reaches current max, spawn.secs = 0 and bar stops
* (done) spawn rate needs to start high, but go down
* (done) cooked chicken slowly goes up
* (done) reduce delay of cooked chicken until purge

## ( done 09/19/2021 ) - 0.5.13 - chicken-cooker-sheets: spawn bar
* (done) have an update walk cells helper
* (done) call still cook 'out' state chickens
* (done) adjust bounds for where 'out' state chickens purge
* (done) have a spawn bar at the top of the canvas 
* (done) the spawn bar will show currentMaxActive relative to maxActive as a white bar
* (done) the spawn bar will show active / currentMaxActive as a green bar within the white bar

## ( done 09/19/2021 ) - 0.5.12 - chicken-cooker-sheets: purge out chickens that are over
* (done) have a poolMod.getActiveObjects method
* (done) in the event that the current active number of chickens > current max active we need to purge chickens
* (done) chickens purged out this way to not effect score or CPM
* (done) have the chickens walk off the canvas first

## ( done 09/19/2021 ) - 0.5.11 - chicken-cooker-sheets: max Active count of chickens
* (done) have new values for setting max active chickens
* (done) have and display a cookedPerMinute value
* (done) let the cooked per minute value be what will set the current max active value for spawning

## ( done 09/18/2021 ) - 0.5.10 - start chicken-cooker-sheets demo
* (done) keep chicken-cooker demo simple and start a new chicken-cooker-sheets demo based off of it
* (done) expand chicken-cooker-sheets first skin folder to have at least one more set of images for chick-walk and chick-rest
* (done) make changes to pool-sprite draw method so that it will use a disp.data.imageIndex value

## ( done 09/18/2021 ) - 0.5.9 - image index array for sprite sheets
* (done) make it so that an array of image index values can be given for a sprite sheet
* (done) update pool-sprite method to look for a disp.data.imageIndex prop, and default the value to 0

## ( done 09/15/2021 ) - 0.5.9 - rework chicken-cooker to use three sprite sheets for chickens
* (done) start a new skin-emme1-128-4 folder based off of skin-emme1-128
* (done) use 0.png for a chick-walk sheet
* (done) use 1.png for a chick-rest sheet
* (done) use 2.png for a chick-cooked sheet
* (done) use 3.png for a background sheet

## ( done 09/15/2021 ) - 0.5.8 - update chicken cooker to use pool-sprite method
* (done) had to add utils.logOnce to help with debugging
* (done) update chicken-cooker demo to use pool-sprite method over pool

## ( done 09/15/2021 ) - 0.5.7 - canvasMod: mod-pool.js plugin pool methods
* (done) start a new 'pool-imgd' method that is the same as the 'pool' method
* (done) for now make it so that 'pool' just calls 'pool-imgd' so that demos do not break
* (done) have a pool-sprite method in mod-pool.js that will look for a sprite sheet reference
* (done) update spritesheet demo to use pool-sprite method over pool
* (done) update chicken-cooker demo to use new canvasMod.createSpriteSheetGrid

## ( done 09/14/2021 ) - 0.5.6 - spritesheet-ships demo: random start positions, and speeds
* (done) have ships spawn at random start locations
* (done) have ships start at random headings
* (done) have two pps values for fast and slow
* (done) use 'wrapping' for when ships go out of bounds

## ( done 09/14/2021 ) - 0.5.5 - spritesheet-ships demo: new spritesheet and heading prop used
* (done) fixed a simple bug with canvasMod.createSpriteSheetGrid method
* (done) start a new spritesheet-ships demo based off of the spritesheets demo 
* (done) edit 0.png so that we have a ship for each direction and speed
* (done) the heading prop of a ship pool object should be what sets the cell index

## ( done 09/13/2021 ) - 0.5.4 - spritesheet demo: Object pool added, and new sheets
* (done) use 0.png for a four cell fire pellets animation
* (done) use 1.png for a ship animation sheet grid where the x axis is wing sweep and the y axis is direction (2 * 8)
* (done) have an object pool that will be used for fire pellets

## ( done 09/13/2021 ) - 0.5.3 - canvasMod: built in methods for creating sprite sheets
* (done) have a canvasMod.createSpriteSheetGrid method that will create a sprite sheet
* (done) createSpriteSheetGrid just takes a cellWidth and cellHeight argument to create the array of cell objects that way
* (done) update spritesheet demo to use new canvasMod.createSpriteSheetGrid method

## ( done 09/13/2021 ) - 0.5.3 - update chicken-cooker to use new sprite sheet system
* (done) create a new chick-walk-rest sprite sheet object
* (done) use new chick-walk-rest for drawing cells in place of custom system

## ( done 09/12/2021 ) - 0.5.2 - canvasMod: cell draw method
* (done) start out with a draw cell method in the spritesheet demo
* (done) have a cell draw method that will take a spriteSheet index or name, cell index, x, y, w, and h values
* (done) the result of calling the cell draw method is to draw a given cell index of a given sprite sheet
* (done) make this method built into canvasMod

## ( done 09/12/2021 ) - 0.5.1 - - canvasMod: createSpriteSheet object method
* (done) I will want a create sprite sheet method for canvasMod
* (done) I will want to start a spritesheet demo based of the loader demo
* (done) a spriteSheet object should have a name prop
* (done) a spriteSheet object contains a ref to the image that it will use
* (done) a spriteSheet object will contain an array of cell info objects
* (done) a spriteSheet object should contain:
    * (done) an array of cell info objects where each object is x, y, w, and h values for a cell source index in the image
    * (done) or a function that when called with a cellIndex will return such an object
* (done) the images prop should really be a property of a canvas stack object actually
* (done) when calling the createSpriteSheet object method I give an image index, and arguments that have to do with the state of cells

## ( done 09/12/2021 ) - 0.5.0 - image array part of stack
* (done) make the image array part of a canvas stack rather than that of the main sm object
* (done) update loader demo to work for this change
* (done) update chicken-cooker demo to work for this change

<!-- ########## ########## -->
## 0.4.x - Loader
<!-- ########## ########## -->

## ( done 09/11/2021 ) - 0.4.10 - chicken-cooker image sets
* (done) have more than one set of images for skinning the demo

## ( done 09/07/2021 ) - 0.4.9 - chicken-cooker spawn rate
* have a spawn rate feature

## ( done 09/07/2021 ) - 0.4.8 - more work on buttons and menus
* (done) draw desc values for buttons

## ( done 09/07/2021 ) - 0.4.7 - chicken-cooker purge methods for chickens pool
* (done) have a poolMod.purge method
* (done) have an on purge method for the chicken pool
* (done) have just a score value for the game object
* (done) display the score value of course
* (done) each pureged chicken that is cooked will add to game.score

## ( done 09/07/2021 ) - 0.4.6 - chicken-cooker fine grain methods in game.js
* (done) have fine grain methods for spawn, and update for create chicken pool helper in game.js
* (done) have an object of methods for each chicken state and call the methods in update chicken
* (done) have a create blasts helper.

## ( done 09/07/2021 ) - 0.4.5 - chicken-cooker more work
* (done) have a way to set what state the sm should change to when loading is done in the loader object
* (done) have a 'live', 'rest', and 'cooked' state for a chicken
* (done) start a game.js file that can be used to create and return a game object

## ( done 09/05/2021 ) - 0.4.4 - chicken-cooker on overlap with other chicken
* (done) check if a chicken is overlapping with another
* (done) when one chicken is overlapping with another it will get a new target position

## ( done 09/04/2021 ) - 0.4.3 - chicken-cooker both directions
* (done) have the live chicken sprite work with the right direction

## ( done 09/04/2021 ) - 0.4.2 - chicken-cooker images
* (done) have 0.png be four cells for a chicken, can use the one from link to the past
* (done) have 1.png be an image of a drum stick
* (done) skin display objects with images

## ( done 09/04/2021 ) - 0.4.1 - start a chicken-cooker demo
* (done) start a new demo called chicken-cooker based off of the loader demo as a start point
* (done) have a chickens object pool
* (done) chickens will spawn in from outside of the canvas and then move into a radius inside the canvas
* (done) chickens start out in a 'live' state rather than a 'cooked' state
* (done) when inside the radius they will pause at a target location for a delay
* (done) once the delay is over they will move to a new random target location in the radius
* (done) have a blasts object pool
* (done) the player can click a location and at that location a blast will start
* (done) any chicken that is in the blast radius will be set to cooked state
* (done) after another delay in the cooked state the display object will no longer be active

## ( done 09/03/2021 ) - 0.4.0 - Asset Loader started
demos/loader:
* (done) start a loader demo based off of menus demo
* (done) the demo will need an images folder
utils.js:
* (done) I will want a utils.http
/node/serveDemo:
* (done) I am going to want a simple server script to just serve a demo by way of http
gameframe.js:
* (done) gameframe.js should include an asset loader that uses utils.http
* (done) have a built in load state object that is created and added to sm.states when gameFrame.create is called
* (done) have an loader option for fameFrame.create
* (done) just go with a system where we have 0.png, 1.png, ect
* (done) display a process bar while in load state

<!-- ########## ########## -->
## 0.3.x - Buttons
<!-- ########## ########## -->

## ( done 09/02/2021 ) - 0.3.0 - buttons started
gameframe.js:
* (done) have a buttons property of a state object like that in orb match
* (done) start a menus demo that will make use of buttons feature
* (done) I will want to call a buttonCheck helper each time a global pointer event happens
* (done) I will want to have a draw buttons method in a buttons canvas plugin

<!-- ########## ########## -->
## 0.2.x - Object pool lib
<!-- ########## ########## -->

## ( done 09/01/2021 ) - 0.2.0 - object pool
pool.js:
* (done) having an object pool lib for this will be a must maybe start with the canvas example on it
canvas.js:
* (done) I will want a plugin folder for lib/canvas
* (done) have circle.js be the first plugin in the plugin folder
* (done) I should be able to call oval points method from circle method
* (done) have a coreArgu array for canvasMod.createPoints and have a ref to the plugin be one of the values along with stack
* (done) have a canvas mod plugin for pool.js, and start off with a pool draw method
/demos/pool:
* (done) have a pool.secsCap option
* (done) have a pool.disableLifespan feature that will just disable lifespan all together
* (done) update hello world demo to make use of new object pool feature

<!-- ########## ########## -->
## 0.1.x - Create Options
<!-- ########## ########## -->

## ( done 09/01/2021 ) - 0.1.0 - additional gameFrame.create options
* (done) gameFrame.smCreateMain width and height options

<!-- ########## ########## -->
## 0.0.x - First state of framework
<!-- ########## ########## -->

## ( done 08/29/2021 ) - 0.0.0 - first state of framework
todo.md:
* (done) start todo list
* (done) have a /css folder for the css used for the canvas module
utils.js:
* (done) start a utils.js file with what I have in js-javascript-example-utils in the lib folder
* (done) remove the canvas methods from utils because I am using the canvas mod
canvas.js:
* (done) I will want to use my new canvas module as part of this framework so add that to the /lib folder
* (done) print draw method now built into canvas.js
gameframe.js:
* (done) start a /lib/gameframe folder that will contain the state of the game framework code so far
* (done) the utils sm methods should be a part of /lib/gameframe
* (done) have a canvas stack created with the canvas mod as a property of the sm object in gameframe.js
/demos/hello-world:
* (done) start first demo folder called hello-world
* (done) display hello world text in demo
* (done) have the text move back and forth making use of a state update loop
* (done) have pointer events have an effect on game state

