
## button options

```js
// option 1 - full object setting all props
var state = {
    buttons: {
        back: { x: 20, y: 20, w: 128, h: 32, disp: 'Back', onClick: function(e, pos, sm, button){
            gameFrame.smSetState(sm, 'mainMenu');
        }}
    }
}

// option 2 - object but leaving some things to default, and using a string shorthad for onClick
var state = {
    buttons: {
        back: { x: 20, y: 20, disp: 'Back', onClick: 'setState-mainMenu'}
    }
};

// option 3 - string, but with custom onClick
var state = {
    buttons: {
        back: { string: '20;20;128;32;Back;', onClick: function(e, pos, sm, button){
            gameFrame.smSetState(sm, 'mainMenu');
        }}
    }
};

// option 4 - String only
var state = {
    buttons: {
        back: '20;20;128;32;Back;setState-mainMenu'
    }
};
```