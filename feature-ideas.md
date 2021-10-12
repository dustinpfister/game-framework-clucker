## game-framework-clucker feature ideas

When I have an idea for a new feature for this project I start out by writing it down here. I then draft out my todo list when it 
comes to actual lined up revisions of the over all framework.

## (  ) - x.x.x - save state system
* start a save state system as a new lin called storage.js
* start out with just localStorage as a means to store save states
* have a public method than can be used to create and return a built in menu for save states

## (  ) - 0.x.x - chicken-cooker-weapons: new system for images
* start a new system for chicken sheets that allows for more animations, and have all cells for a chicken in one sheet
* reserve 0.png - 9.png for images other than chicken sheets
* any unused images can just be blank place holder images for now if that works
* first 10.png can be the first chicken type sheet, and 11 can be the second based off of current images
* have an image for change weapons button

## (  ) - 0.x.x - /img root folder started
* start a /img root folder that will contain images used in the various demos
* start a /img/chicken-cooker/cc-128 folder for 'chicken-cooker' demo
* start a /img/chicken-cooker/cc-funfacts folder and get it to work with 'chicken-cooker-fun-facts', and 'chicken-cooker-sheets'
* start a /img/chicken-cooker/cc-weapons folder for 'chicken-cooker-weapons'

## (  ) - 0.x.x - chicken-cooker-fun-facts: brow disp object
* make changes to fun facts so that the eyebrows are animated

## (  ) - 0.x.x - chicken-cooker-fun-facts: eyes disp object
* make changes to fun facts so that the eyes are animated

## (  ) - 0.x.x - User Event system
* add an event system based off of what I made for js-custom-event

## (  ) - 0.x.x - object pool purge condition array
* make to so that a purge condition can also be an array of conditions

## (  ) - 0.x.x - object pool purge condition feature
* have a purgeCondition feature as an option for creating a pool
* a purge condition can be a function, or a string for a built in purge condition
* default purgeCondition is 'lifespan'
* have a createDefaultDataObject helper function that will create a default data object.
* have an hp stat object be part of the default data object
* have a built in 'hp' purgeCondition

## (  ) - 0.x.x - utils.saveState, and utils.loadState
* have a utils.saveState and utils.loadState methods
* methods just make use of web storage api
* follow a pattern of gameKey, slotKey, and stateObject for the save method
* follow a pattern of gameKey and alotKey for load method

## (  ) - 0.x.x - canvasMod: createAnimation object
* have a create animation object method
* an animation object should have a name prop
* an animation object should have a ref to the spriteSheet object to use
* an animation object should have an array of cell index values in the spriteSheet the compose the animation
* an animation object has a cellIndex prop that is the current index in the cell index array to use
* update sprite sheet demo to use the create animation object method

## (  ) - 0.x.x - renamed /lib to /lib-client and start a /lib-client/[libName]/[x.x.x]/[filename].js pattern
* rename /lib to lib-client
* have a version folder for each lib folder in lib-client
* start each version folder at 0.0.0 or the best number for the project that is was based on
* have a readme file in each lib folder that outlines what the file was pased on
* in the readme file link to any relavent folders in repos like test\_vjs or canvas\_examples
* in the readme file link to any relavent blog posts on the lib at dustinpfiste.github.io
* have a todo and features lists for each lib to outline what needs to change for each lib

