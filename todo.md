# game-framework-clucker todo list

## (  ) - 0.x.0 - Grid library
* add a library that can be used to create, update, and work with a simple 2d grid of tiles

## (  ) - 0.x.0 - User Event system
* add an event system based off of what I made for js-custom-event


## (   ) - 0.x.x - chicken-cooker: 0.png - 3.png
* use 0.png for a chick-walk sheet
* use 1.png for a chick-rest sheet
* use 2.png for a chick-cooked sheet
* use 3.png for a background sheet

## (  ) - 0.x.x - canvasMod: createAnimation object
* have a create animation object method
* an animation object should have a name prop
* an animation object should have a ref to the spriteSheet object to use
* an animation object should have an array of cell index values in the spriteSheet the compose the animation
* an animation object has a cellIndex prop that is the current index in the cell index array to use
* update sprite sheet demo to use the create animation object method


## (  ) - 0.5.5 - canvasMod: mod-pool.js plugin pool methods
* call the current pool method pool-imgd
* update chicken-cooker demo to use pool-imgd
* have a pool-sprite method in mod-pool.js that will look for a sprite sheet reference
* the plain pool method can be used to just pain a solid background
* update spritesheet demo to use pool-sprite method

## (  ) - 0.5.4 - spritesheet demo: Object pool added, and new sheets
* (done) use 0.png for a four cell fire pellets animation
* (done) use 1.png for a ship animation sheet grid where the x axis is wing sweep and the y axis is direction (2 * 8)
* have an object pool that will be used for fire pellets
* have an object pool that will be used for ships

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

