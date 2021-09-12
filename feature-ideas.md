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

## () - canvasMod: createAnimation object
* have a create animation object method
* an animation object should have a name prop
* an animation object should have a sheet index or name to use
* an animation object should have an array of cell index values the compose the animation

## () - canvasMod: cell draw method
* have a cell draw method that will take a spriteSheet index or name, cell index, x, y, w, and h values
* the result of calling the cell draw method is to draw a given cell index of a given sprite sheet

## () - canvasMod: createSpriteSheet object method
* I will want a create sprite sheet method for canvasMod
* a spriteSheet object should have a name prop
* a spriteSheet object contains a ref to the image that it will use
* a spriteSheet object will contain a number of cells
* a spriteSheet object should contain:
    * an array of objects where each object is x, y, w, and h values for a cell index
    * or a functon that when called with a cellIndex will return such an object
* the images prop should really be a property of a canvas stack object actually
* when calling the createSpriteSheet object method I give an image index, and arguments that have to do with the state of cells
* one system can be that I just given a cellWidth, and cellHeight to just index cells that way
