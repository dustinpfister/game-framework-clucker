
(function (api) {

    /********* ********** ********** **********
      PUBLIC METHODS
    *********** ********** ********** ********/

    api.createSheets = function(sm, imageIndices){

        imageIndices = imageIndices || [2, 3];
     
        var talkCell = [ { x: 0, y: 0, w: 256, h: 128 }]   
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-talk', imageIndices[0], talkCell);

    };

    // create and return a fun facts object
    api.create = function(){
        var funFacts = {
           disp: {} // display objects
        };
        // talk bubble display obect
        funFacts.disp.talk = {
            x: 100,
            y: 100,
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
        return funFacts;
    };

    // update a fun facts object
    api.update = function(funFacts){

    };

    return api;

}
    (this['funFactsMod'] = {}));
