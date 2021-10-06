
(function (api) {

    /********* ********** ********** ********** *********/
    //  CREATE State Machine PUBLIC Methods and helpers
    /********* ********** ********** ********** *********/

    // create a minamal sm object ( For setting up a nested sm object, and the base of a main sm object )
    api.smCreateMin = function (opt) {
        opt = opt || {};
        // return a base sm object
        var sm = {
            currentState: opt.currentState || '', // current state key
            data: {}, // a user data object for the state
            stateObj: {}, // use for a ref to current state object
            states: opt.states || {},
            events: opt.events || {}
        };
        return sm;
    };

    // helpers for main create method
    var callStateObjectPointerEvent = function (pointerType, e, pos, sm) {
        var state = sm.states[sm.currentState],
        handler;
        if (state) {
            handler = state.events[pointerType];
            if (handler) {
                handler.call(sm, e, pos, sm);
            }
        }
    };
    // check if a button was clicked for the current state, if so call the onClick method for it
    var buttonCheck = function (e, pos, sm) {
        var state = sm.states[sm.currentState];
        var buttonKeys = Object.keys(state.buttons);
        var i = 0,
        len = buttonKeys.length,
        button;
        while (i < len) {
            button = state.buttons[buttonKeys[i]];
            if (utils.boundingBox(button.x, button.y, button.w, button.h, pos.x, pos.y, 1, 1)) {
                button.onClick.call(sm, e, pos, sm, button);
            }
            i += 1;
        }
    };

    var pushLoaderState = function (sm) {
        Clucker.gameFrame.smPushState(sm, {
            name: 'loader',
            start: function (sm) {
                // make sure data.loaded = 0;
                sm.states.loader.data.loaded = 0;
                // background
                canvasMod.draw(sm.layers, 'background', 0);
                // set up images array
                sm.images = [];
                var images = sm.layers.images = [];
                var loaderObj = sm.loader;
                // if we have images to load start the requests for them
                if (sm.loader.images) {
                    var i = 0;
                    while (i < sm.loader.images.count) {
                        (function (imageIndex) {
                            utils.httpPNG({
                                url: sm.loader.images.baseURL + '/' + imageIndex + '.png',
                                // set to sm images if all goes well
                                onDone: function (image, xhr) {
                                    console.log('image ' + imageIndex + ' loaded: ');
                                    // OLD ARRAY
                                    //sm.images[imageIndex] = image;
                                    // NEW ARRAY
                                    images[imageIndex] = image;
                                },
                                // just a blank image for now if there is an error
                                onError: function () {
                                    console.log('error')
                                    // OLD ARRAY
                                    sm.images[imageIndex] = new Image();
                                    // NEW ARRAY
                                    images[imageIndex] = new Image();
                                }
                            });
                        }
                            (i));
                        i += 1;
                    }
                }
            },
            end: function (sm) {
                canvasMod.draw(sm.layers, 'clear', 0);
                canvasMod.draw(sm.layers, 'clear', 1);
            },
            update: function (sm, secs) {
                var data = sm.states.loader.data;
                var loaded = data.loaded = sm.layers.images.reduce(function (acc, el) {
                        return el === undefined ? acc : acc + 1;
                    }, 0);
                if (loaded === sm.loader.images.count) {
                    Clucker.gameFrame.smSetState(sm, sm.loader.startState || 'game');
                }
            },
            draw: function (sm, layers) {
                var ctx = layers[1].ctx,
                canvas = layers[1].canvas,
                cx = canvas.width / 2,
                cy = canvas.height / 2;
                // clear
                canvasMod.draw(layers, 'clear', 1);

                var loaded = sm.states.loader.data.loaded;

                // if images
                if (sm.loader.images) {
                    ctx.fillStyle = 'white'
                        ctx.strokeStyle = 'black';
                    ctx.beginPath();
                    ctx.rect(0, cy - 10, canvas.width * (loaded / sm.loader.images.count), 10);
                    ctx.fill();
                    ctx.stroke();
                    canvasMod.draw(layers, 'print', 1, loaded + ' / ' + sm.loader.images.count, cx, cy + 15, {
                        align: 'center',
                        fontSize: 30
                    });
                }
            }
        });
    };
    // create the main sm object
    api.smCreateMain = function (opt) {
        opt = opt || {};
        // create base sm object
        var sm = api.smCreateMin(opt);
        // values that can be set by options
        sm.ver = opt.ver || '';
        sm.game = opt.game || {};
        sm.fps = opt.fps === undefined ? 30 : opt.fps;
        sm.loader = opt.loader || {};
        sm.images = [];
        // events
        sm.events = opt.events || {
            pointerStart: function (e, pos, sm) {
                buttonCheck(e, pos, sm);
                callStateObjectPointerEvent('pointerStart', e, pos, sm);
            },
            pointerMove: function (e, pos, sm) {
                callStateObjectPointerEvent('pointerMove', e, pos, sm);
            },
            pointerEnd: function (e, pos, sm) {
                callStateObjectPointerEvent('pointerEnd', e, pos, sm);
            }
        };
        // set up stack of canvas layers using the canvas module
        sm.layers = canvasMod.createLayerStack({
                length: opt.canvasLayers === undefined ? 3 : opt.canvasLayers,
                container: opt.canvasContainer || document.getElementById('canvas-app') || document.body,
                events: sm.events,
                state: sm,
                width: opt.width,
                height: opt.height
            });
        sm.debugMode = opt.debugMode || false;
        // value that should not be set by options
        sm.secs = 0;
        sm.stopLoop = false;
        sm.lt = new Date();
        // if sm.loader.images push built in loader state
        if (sm.loader.images) {
            pushLoaderState(sm);
        }
        // main loop
        sm.loop = function () {
            var now = new Date();
            sm.secs = (now - sm.lt) / 1000;
            if (sm.secs >= 1 / sm.fps) {
                // update
                var update = sm.stateObj.update;
                if (update) {
                    update.call(sm, sm, sm.secs);
                }
                // draw
                // getting state object by sm.stateObj will ensure that the draw
                // method for the current state is drawn in the event that a change of state happens.
                var drawMethod = sm.stateObj.draw;
                if (drawMethod) {
                    drawMethod.call(sm, sm, sm.layers, canvasMod);
                }
                sm.lt = now;
            }
            // if sm.stopLoop === false, then keep looping
            if (!sm.stopLoop) {
                requestAnimationFrame(sm.loop);
            }
        };
        // make sure sm.stateObj is the currentState
        if (sm.currentState) {
            sm.stateObj = sm.states[sm.currentState];
        }
        // stop loop on any page error
        /*
        window.addEventListener('error', function (e) {
        if (sm.debugMode) {
        sm.stopLoop = true;
        console.log('error: ' + e.message);
        console.log(e);
        console.log('loop stoped');
        }
        });
         */
        return sm;
    };

    /********* ********** ********** ********** *********/
    //  PUSH NEW STATE OBJECTS
    /********* ********** ********** ********** *********/

    // push a new state object
    api.smPushState = function (sm, opt) {
        var state = {
            name: opt.name || 'state_' + Object.keys(sm.states).length,
            data: opt.data || {}
        };
        state.buttons = opt.buttons || {};
        state.start = opt.start || function () {};
        state.end = opt.end || function () {};
        state.update = opt.update || function () {};
        state.draw = opt.draw || function () {};
        state.events = opt.events || {};
        sm.states[state.name] = state;
        return state;
    };

    /********* ********** ********** ********** *********/
    //  SET THE CURRENT STATE
    /********* ********** ********** ********** *********/

    // set the current state
    api.smSetState = function (sm, newState) {
        // get a ref to the old state
        var oldState = sm.states[sm.currentState];
        // call the on end hook for the old state if it has one
        if (oldState) {
            var endHook = oldState.end;
            if (endHook) {
                endHook.call(sm, sm);
            }
        }
        // change to the new state, and call the start hook it it has one
        sm.currentState = newState;
        var newState = sm.stateObj = sm.states[sm.currentState];
        var startHook = newState.start;
        if (startHook) {
            startHook.call(sm, sm, canvasMod);
        }
    };
}
    (this['Clucker'] === undefined ? this['gameFrame'] = {}
         : Clucker['gameFrame'] = {}));

// create Clucker methods
if (this['Clucker']) {
    // Clucker.createMain
    Clucker.createMain = function (opt) {
        return Clucker.gameFrame.smCreateMain(opt);
    };
    // Clicker.pushState
    Clucker.pushState = function (sm, opt) {
        return Clucker.gameFrame.smPushState(sm, opt);
    };
    Clucker.setState = function (sm, key) {
        return Clucker.gameFrame.smSetState(sm, key);
    };
}
