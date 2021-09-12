## () - object pool purge condition array
* make to so that a purge condition can also be an array of conditions

## () - object pool purge condition feature
* have a purgeCondition feature as an option for creating a pool
* a purge condition can be a function, or a string for a built in purge condition
* default purgeCondition is 'lifespan'
* have a createDefaultDataObject helper function that will create a default data object.
* have an hp stat object be part of the default data object
* have a built in 'hp' purgeCondition

## () - utils.saveState, and utils.loadState
* have a utils.saveState and utils.loadState methods
* methods just make use of web storage api
* follow a pattern of gameKey, slotKey, and stateObject for the save method
* follow a pattern of gameKey and alotKey for load method
