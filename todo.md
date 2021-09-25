# game-framework-clucker todo list


## (  ) - 0.6.0 - Clucker r6 released
* update readme.
* create a /dist/clucker.js and clucker.min.js at this state
* create a 0.6.0 tag


## () - 0.5.x - chicken-cooker-fun-facts: brow disp object

## () - 0.5.x - chicken-cooker-fun-facts: eyes disp object

## () - 0.5.25 - utils.wrapText
* first update all demos to use at least 0.5.24
* create a utils.wrapText method based off of what I have for chicken-cooker-fun-facts
* have chicken-cooker-fun-facts use 0.5.25 and new utils.wrapText method

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

## ( done 09/02/2021 ) - 0.3.0 - buttons started
gameframe.js:
* (done) have a buttons property of a state object like that in orb match
* (done) start a menus demo that will make use of buttons feature
* (done) I will want to call a buttonCheck helper each time a global pointer event happens
* (done) I will want to have a draw buttons method in a buttons canvas plugin

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

## ( done 09/01/2021 ) - 0.1.0 - additional gameFrame.create options
* (done) gameFrame.smCreateMain width and height options

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

