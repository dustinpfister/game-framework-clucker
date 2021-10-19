# game-framework-clucker feature ideas

When I have an idea for a new feature for this project I start out by writing it down here. I then draft out my todo list when it 
comes to actual lined up revisions of the over all framework.

<!-- ########## ########## -->
## More Work on upgrades.js
<!-- ########## ########## -->

## (  ) - 0.x.0 - More work on upgrades
* have a helper in upgrades.js that can be used to create a game.upgrades array
* have a global weapons upgrade for chicken-cooker-weapons demo to finish up that demo

<!-- ########## ########## -->
## User Events
<!-- ########## ########## -->

## (  ) - 0.x.0 - User Event system
* add an event system based off of what I made for js-custom-event

<!-- ########## ########## -->
## More work on object pool library
<!-- ########## ########## -->

## (  ) - 0.x.0 - object pool purge condition array
* make to so that a purge condition can also be an array of conditions

## (  ) - 0.x.0 - object pool purge condition feature
* have a purgeCondition feature as an option for creating a pool
* a purge condition can be a function, or a string for a built in purge condition
* default purgeCondition is 'lifespan'
* have a createDefaultDataObject helper function that will create a default data object.
* have an hp stat object be part of the default data object
* have a built in 'hp' purgeCondition

<!-- ########## ########## -->
## Additional Work on Demos
<!-- ########## ########## -->

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



