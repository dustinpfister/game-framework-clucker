# chicken-cooker-sheets

As of clucker 0.5.9 changes have been made to the canvas module that allow for setting an array of index values for images in the image array of a canvas layer stack created with canvasMod.createStack, rather than having a single image reference. Changes have also been made to the pool-sprite draw method in the object pool canvas plugin to make use of this new system. The changes have been made so that it does not result in code braking changes for the demos thus far at this point at least. However I still want to make at least one demo that makes use of this feature that allows for more than one image to be used with sprite sheet. Also while working on this demo I made additional changes that will be part of 0.5.10+ of clucker.

