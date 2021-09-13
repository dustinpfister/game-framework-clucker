## game-framework-clucker feature ideas

When I have an idea for a new feature for this project I start out by writing it down here. I then draft out my todo list when it 
comes to actual lined up revisions of the over all framework.

## () - x.x.x - object pool purge condition array
* make to so that a purge condition can also be an array of conditions

## () - x.x.x - object pool purge condition feature
* have a purgeCondition feature as an option for creating a pool
* a purge condition can be a function, or a string for a built in purge condition
* default purgeCondition is 'lifespan'
* have a createDefaultDataObject helper function that will create a default data object.
* have an hp stat object be part of the default data object
* have a built in 'hp' purgeCondition

## () - x.x.x - utils.saveState, and utils.loadState
* have a utils.saveState and utils.loadState methods
* methods just make use of web storage api
* follow a pattern of gameKey, slotKey, and stateObject for the save method
* follow a pattern of gameKey and alotKey for load method

## () - x.x.x - renamed /lib to /lib-client and start a /lib-client/[libName]/[x.x.x]/[filename].js pattern
* rename /lib to lib-client
* have a version folder for each lib folder in lib-client
* start each version folder at 0.0.0 or the best number for the project that is was based on
* have a readme file in each lib folder that outlines what the file was pased on
* in the readme file link to any relavent folders in repos like test\_vjs or canvas\_examples
* in the readme file link to any relavent blog posts on the lib at dustinpfiste.github.io
* have a todo and features lists for each lib to outline what needs to change for each lib