
(function (api) {

    var FF_X_START = -400,
    FF_X_DELTA = 620,
    FF_PPS = 512,
    FF_LEAVE_DELAY = 1; // amount of time until the guy will leave


    var TRIGGERS = {
        idle: {
            key: 'idle',
            condition: function(funFacts){
                return funFacts.idleSecs >= 10;
            },
            says: [
                'This is chicken cooker fun facts, to play just click or tab the canvas to start cooking chickens'
            ]
        }
    };

    /********* ********** ********** **********
      HELPERS
    *********** ********** ********** ********/

    // set the position of the disp objects ( using data.homeX realtive to funFacts.x )
    var setDispPositons = function(funFacts){
         Object.keys(funFacts.disp).forEach(function(dispKey){
             var disp = funFacts.disp[dispKey];
             disp.x = funFacts.x + disp.data.homeX;
             disp.y = funFacts.y + disp.data.homeY;
         });
    };

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
            { x: 0, y: 0, w: 128, h: 128 }, // cell 0 is the base image for the guy
            { x: 128, y: 0, w: 64, h: 64 }, // cell 1-3 hair
            { x: 128 + 64, y: 0, w: 64, h: 64 },
            { x: 128 + 128, y: 0, w: 64, h: 64 }
        ];
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-guy', imageIndices[1], guyCells);

    };

    // create and return a fun facts object
    api.create = function(){
        var funFacts = {
           x: FF_X_START,
           y: 290,
           active: true,
           secs: 0,
           idleSecs: 0,
           triggers: TRIGGERS,
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
                homeX: 0,
                homeY: 0,
                sheetKey: 'funfacts-talk',
                imageIndex: 0,
                cellIndex: 0,
                alpha: 1
            }
        };
        // base image object of the guy
        funFacts.disp.base = {
            x: 0,
            y: 0,
            w: 128,
            h: 128,
            active: true,
            data: {
                homeX: 256,
                homeY: 64,
                sheetKey: 'funfacts-guy',
                imageIndex: 0,
                cellIndex: 0,
                alpha: 1
            }
        };
        // hair object for the guy
        funFacts.disp.hair = {
            x: 0,
            y: 0,
            w: 64,
            h: 64,
            active: true,
            data: {
                homeX: 256 + 32,
                homeY: 32,
                sheetKey: 'funfacts-guy',
                imageIndex: 0,
                cellIndex: 1,
                alpha: 1
            }
        };

        // set posiitons
        setDispPositons(funFacts);

        return funFacts;
    };

    // update a fun facts object
    api.update = function(sm, funFacts, secs){

        // if active
        if(funFacts.active){
            var homeX = FF_X_START + FF_X_DELTA;
            if(funFacts.x < homeX){
                funFacts.x += FF_PPS * secs;
                funFacts.secs = 0;
            }else{
                funFacts.secs += secs;
                if(funFacts.secs >= FF_LEAVE_DELAY){
                    funFacts.active = false;
                }
            }
            funFacts.x = funFacts.x > homeX ? homeX: funFacts.x;
        }else{


            // else if not active

            if(funFacts.x > FF_X_START){
                funFacts.x -= FF_PPS * secs;
                funFacts.secs = 0;
                funFacts.idleSecs = 0;
            }else{
                funFacts.idleSecs += secs;
                if(funFacts.idleSecs >= 1){
                    funFacts.active = true;
                }
            }
            funFacts.x = funFacts.x < FF_X_START ? FF_X_START: funFacts.x;

        }

        // update positions
        setDispPositons(funFacts);
    };

    // let fun facts no some kind of user action happend
    api.userAction = function(funFacts, type, opt){
        // set idleSecs to 0
        funFacts.idleSecs = 0;
    };

    return api;

}
    (this['funFactsMod'] = {}));
