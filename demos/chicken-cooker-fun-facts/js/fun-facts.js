
(function (api) {

    /********* ********** ********** **********
      PUBLIC METHODS
    *********** ********** ********** ********/

    api.createSheets = function(sm, imageIndices){

        imageIndices = imageIndices || [2, 3];
     
        var talkCell = [ { x: 0, y: 0, w: 256, h: 128 }]   
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-talk', imageIndices[0], talkCell);

        console.log(sm.layers);

    };

    // create and return a fun facts object
    api.create = function(){
        var funFacts = {};
        return funFacts;
    };

    // update a fun facts object
    api.update = function(funFacts){

    };

    return api;

}
    (this['funFactsMod'] = {}));
