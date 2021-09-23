
(function (api) {

    var FF_X_START = -400,
    FF_X_DELTA = 620,
    FF_PPS = 512,
    FF_IDLE_TRIGGER_TIME = 15,
    SAY_WIDTH = 35; // amount of time until the guy will leave

    /********* ********** ********** **********
    TRIGGERS
     ********** ********** ********** *********/

    var TRIGGERS = {};

    // idle trigger
    TRIGGERS.idle = {
        key: 'idle',
        activeCondition: function (funFacts) {
            return funFacts.idleSecs >= FF_IDLE_TRIGGER_TIME;
        },
        leaveCondition: function (funFacts) {
            if (funFacts.idleSecs < FF_IDLE_TRIGGER_TIME) {
                return true;
            }
            return false;
            //return funFacts.talkSecs >= 30;
        },
        says: [
            'This is \"chicken cooker fun facts\" to play just click or touch the canvas to start cooking chickens',
            'Did you know a chicken is a kind of bird?',
            'In real life the process of converting live chickens into food is a little more graphic',
            'Chickens can not fly they just fall with style',
            'I could totally go for a chicken sandwich right now',
            'Did you know that food is made from chickens? They MUST DIE FIRST THOUGH BUA HA HA HA!'
        ],
        init: function (funFacts) {
            console.log('idle trigger started');
            funFacts.sayIndex = 0;
            funFacts.lines = []
        },
        done: function (funFacts) {
            console.log('idle trigger done');
            funFacts.idleSecs = 0;
        },
        update: function (funFacts) {
            var says = funFacts.triggers.idle.says;
            //console.log('tick');
            funFacts.sayIndex = Math.floor(funFacts.talkSecs / 10);
            if (funFacts.sayIndex >= says.length) {
                funFacts.sayIndex = 0;
                funFacts.talkSecs = 0;
            }
            funFacts.lines = wrapSay(funFacts.triggers.idle.says[funFacts.sayIndex]);
        }
    };

    // idle trigger
    TRIGGERS.cpm = {
        key: 'cpm',
        activeCondition: function (funFacts) {
            var game = funFacts.sm.game,
            avg_cpm = game.cpm.avg;
            if (funFacts.CPMValues === undefined || avg_cpm === 0) {
                funFacts.CPMValues = [50, 100, 200, 300];
                funFacts.bestCPM = 0;
            }
            funFacts.bestCPM = avg_cpm > funFacts.bestCPM ? avg_cpm : funFacts.bestCPM;
            if (funFacts.CPMValues.length > 0) {
                if (funFacts.bestCPM >= funFacts.CPMValues[0]) {
                    funFacts.sayIndex = 4 - funFacts.CPMValues.length;
                    funFacts.lines = wrapSay(funFacts.triggers.cpm.says[funFacts.sayIndex]);
                    funFacts.CPMValues.shift();
                    return true;
                }
            }
            return false;
        },
        leaveCondition: function (funFacts) {
            return funFacts.talkSecs >= 10;
        },
        says: [
            'You have a Chickens Per Minute speed of 50. Not Bad.',
            'You have a Chickens Per Minute speed of 100. Not Bad.',
            'You have a Chickens Per Minute speed of 200. Not Bad.',
            'You have a Chickens Per Minute speed of 300. Not Bad.'
        ],
        init: function (funFacts) {},
        done: function (funFacts) {},
        update: function (funFacts) {}
    };

    /********* ********** ********** **********
    HELPERS
     ********** ********** ********** *********/

    // set the position of the disp objects ( using data.homeX relative to funFacts.x )
    var setDispPositons = function (funFacts) {
        Object.keys(funFacts.disp).forEach(function (dispKey) {
            var disp = funFacts.disp[dispKey];
            disp.x = funFacts.x + disp.data.homeX;
            disp.y = funFacts.y + disp.data.homeY;
        });
    };

    // check if fun facts guy should be set active
    // and update funFacts.currentTrigger to the trigger that set
    // him active
    var triggerCheck = function (funFacts) {
        var triggerKeys = Object.keys(TRIGGERS),
        trigger,
        i = triggerKeys.length;
        while (i--) {
            trigger = TRIGGERS[triggerKeys[i]];
            if (trigger.activeCondition(funFacts)) {
                // update trigger ref
                funFacts.active = true;
                funFacts.currentTrigger = trigger;
                var init = trigger.init || utils.noop;
                init.call(funFacts, funFacts);
                return funFacts.currentTrigger;
            }
        }
        return funFacts.currentTrigger;
    };

    // break a say to a set number of lines
    // based off of this:  https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
    var wrapSay = function (str) {
        var patt = new RegExp(`(?![^\\n]{1,${SAY_WIDTH}}$)([^\\n]{1,${SAY_WIDTH}})\\s`, 'g');
        return str.replace(patt, '$1\n').split('\n');
    };

    // animate helper
    var animate = function (funFacts, secs, dispKey, ciStart, ciEnd, rate) {
        var disp = funFacts.disp[dispKey],
        ci = disp.data.cellIndex;
        disp.data.secs = disp.data.secs === undefined ? 0 : disp.data.secs;
        disp.data.secs += secs;
        if (disp.data.secs >= rate) {
            ci += 1;
            disp.data.cellIndex = ci > ciEnd ? ciStart : ci;
            disp.data.secs = 0;
        }
    };

    // animate mouth short helper
    var animateMouth = function (funFacts, secs) {
        animate(funFacts, secs, 'mouth', 15, 16, 1 / 8);
    };

    // animate hand short helper
    var animateHand = function (funFacts, secs) {
        animate(funFacts, secs, 'hand', 12, 13, 1 / 4);
    };

    /********* ********** ********** **********
    PUBLIC METHODS
     *********** ********** ********** ********/

    api.createSheets = function (sm, imageIndices) {

        imageIndices = imageIndices || [2, 3];

        // sprite sheet for the talk bubble will just be one cell
        var talkCell = [{
                x: 0,
                y: 0,
                w: 256,
                h: 128
            }
        ]
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-talk', imageIndices[0], talkCell);

        // the format for the guy sheet is a little more complex
        var guyCells = [{
                x: 0,
                y: 0,
                w: 128,
                h: 128
            }, // cell 0 is the base image for the guy
            {
                x: 128,
                y: 0,
                w: 64,
                h: 64
            }, // cell 1-3 hair
            {
                x: 192,
                y: 0,
                w: 64,
                h: 64
            }, {
                x: 256,
                y: 0,
                w: 64,
                h: 64
            }, {
                x: 128,
                y: 64,
                w: 64,
                h: 64
            }, // cells 4-5 reserved for brow animation
            {
                x: 192,
                y: 64,
                w: 64,
                h: 64
            }, {
                x: 256,
                y: 64,
                w: 64,
                h: 64
            }, // cell 6 reserved for face fuzz cell
            {
                x: 0,
                y: 128,
                w: 64,
                h: 64
            }, // cells 7 - 11 are resrved for eye cells
            {
                x: 64,
                y: 128,
                w: 64,
                h: 64
            }, {
                x: 128,
                y: 128,
                w: 64,
                h: 64
            }, {
                x: 192,
                y: 128,
                w: 64,
                h: 64
            }, {
                x: 256,
                y: 128,
                w: 64,
                h: 64
            }, {
                x: 0,
                y: 192,
                w: 64,
                h: 128
            }, // cells 12 - 14 are for hand cells
            {
                x: 64,
                y: 192,
                w: 64,
                h: 128
            }, {
                x: 128,
                y: 192,
                w: 64,
                h: 128
            }, {
                x: 192,
                y: 192,
                w: 64,
                h: 64
            }, // cells 15 - 18 are for mouth cells
            {
                x: 256,
                y: 192,
                w: 64,
                h: 64
            }, {
                x: 192,
                y: 256,
                w: 64,
                h: 64
            }, {
                x: 256,
                y: 256,
                w: 64,
                h: 64
            }
        ];
        canvasMod.createSpriteSheet(sm.layers, 'funfacts-guy', imageIndices[1], guyCells);

    };

    // create and return a fun facts object
    api.create = function (sm) {
        var funFacts = {
            sm: sm,
            x: FF_X_START,
            y: 290,
            active: false,
            talkSecs: 0,
            idleSecs: 0,
            sayIndex: 0, // say index and say indices should be updated in an int method of a trigger
            sayIndices: [],
            bestCPM: 0,
            triggers: TRIGGERS,
            currentTrigger: {},
            lines: [], // lines should be updated in init and update methods of triggers
            disp: {}
            // display objects
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

        // mouth object for the guy
        funFacts.disp.mouth = {
            x: 0,
            y: 0,
            w: 64,
            h: 64,
            active: true,
            data: {
                homeX: 256 + 32,
                homeY: 128 - 20,
                sheetKey: 'funfacts-guy',
                imageIndex: 0,
                cellIndex: 15,
                alpha: 1,
                secs: 0
            }
        };

        // mouth object for the guy
        funFacts.disp.hand = {
            x: 0,
            y: 0,
            w: 64,
            h: 128,
            active: true,
            data: {
                homeX: 240,
                homeY: 64,
                sheetKey: 'funfacts-guy',
                imageIndex: 0,
                cellIndex: 12,
                alpha: 1,
                secs: 0
            }
        };

        // set posiitons
        setDispPositons(funFacts);

        return funFacts;
    };

    // update a fun facts object
    api.update = function (sm, funFacts, secs) {
        // if active
        if (funFacts.active) {
            var homeX = FF_X_START + FF_X_DELTA;
            if (funFacts.x < homeX) {
                funFacts.x += FF_PPS * secs;
                funFacts.talkSecs = 0;
            } else {
                funFacts.talkSecs += secs;
                // use leave condition of trigger to know when the trigger is over
                if (funFacts.currentTrigger.leaveCondition.call(funFacts, funFacts)) {
                    funFacts.active = false;
                }
                // animate mouth
                animateMouth(funFacts, secs);
                animateHand(funFacts, secs);
                // if the triiger has an update method call it here
                var updateTrig = funFacts.currentTrigger.update || utils.noop;
                updateTrig.call(funFacts, funFacts);
            }
            funFacts.x = funFacts.x > homeX ? homeX : funFacts.x;
        } else {
            // else if not active
            if (funFacts.x > FF_X_START) {
                funFacts.x -= FF_PPS * secs;
                funFacts.talkSecs = 0;
                //funFacts.idleSecs = 0;
            } else {
                if (funFacts.x < FF_X_START) {
                    funFacts.x = FF_X_START;
                    // call done trigger method
                    var done = funFacts.currentTrigger.done || utils.noop;
                    done.call(funFacts, funFacts);
                }
                funFacts.idleSecs += secs;
                triggerCheck(funFacts);
                if (funFacts.active) {
                    //funFacts.lines = wrapSay(funFacts.currentTrigger.says[0]);
                }
            }
            // mouth closed
            funFacts.disp.mouth.data.cellIndex = 15;
            funFacts.disp.hand.data.cellIndex = 12;
        }
        // update positions
        setDispPositons(funFacts);
    };

    // let fun facts no some kind of user action happend
    api.userAction = function (funFacts, type, opt) {
        // set idleSecs to 0
        funFacts.idleSecs = 0;
    };

    return api;

}
    (this['funFactsMod'] = {}));
