
(function (api) {

    /********* ********** ********** **********
      PUBLIC METHODS
    *********** ********** ********** ********/

    api.createSheets = function(sm, imageIndices){

        imageIndices = imageIndices || [2, 3];
     
        // sprite sheet for the talk bubble will just be one cell
        var talkCell = [ { x: 0, y: 0, w: 256, h: 128 } ]   
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-talk', imageIndices[0], talkCell);

        // the format for the guy sheet is a little more complex
        var guyCells = [
            { x: 0, y: 0, w: 128, h: 128 } // cell 0 is the base image for the guy
        ];
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-guy', imageIndices[1], guyCells);

    };

    // create and return a fun facts object
    api.create = function(){
        var funFacts = {
           disp: {} // display objects
        };
        // talk bubble display obect
        funFacts.disp.talk = {
            x: 0,
            y: 0,
            w: 256,
            h: 128,
            active: true,
            data: {
                sheetKey: 'funfacts-talk',
                imageIndex: 0,
                cellIndex: 0,
                alpha: 1
            }
        };
        // talk bubble display obect
        funFacts.disp.base = {
            x: 256,
            y: 64,
            w: 128,
            h: 128,
            active: true,
            data: {
                sheetKey: 'funfacts-guy',
                imageIndex: 0,
                cellIndex: 0,
                alpha: 1
            }
        };
        return funFacts;
    };

    // update a fun facts object
    api.update = function(funFacts){

    };

    return api;

}
    (this['funFactsMod'] = {}));
