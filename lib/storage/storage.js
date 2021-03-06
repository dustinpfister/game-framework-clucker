(function (storage) {
 
    // private test function
    var test = function () {
        //console.log('web sorage test: ');
        if (!localStorage) {
            //console.log('window.localStorage object not found, pass is false');
            return false;
        }
        // save a test object for key ws-test
        localStorage.setItem('ws-test', JSON.stringify({
                value: 'foo'
            }));
        // try to now get what we just saved
        var string = localStorage.getItem('ws-test');
        if (string) {
            // so we have a string parse to an object
            try {
                var result = JSON.parse(string);
            } catch (e) {
                //console.log('got a dom string, but there was an error parsing JSON some how.');
                return false;
            }
            // so we have an object, is are test value there?
            var pass = result.value === 'foo';
            //console.log('Got an object and value test pass is: ' + pass);
            // in any case remove the item
            localStorage.removeItem('ws-test');
            // return result of pass boolean if all is well it should be true
            return pass;
        }
        //console.log('No result object pass is false');
        return false;
    }
 
    // public test function
    storage.test = function (opt) {
        opt = opt || {};
        opt.onDisabled = opt.onDisabled || function () {};
        // feature test for local storage
        if (test()) {
            return true;
        }
        opt.onDisabled.call(opt, opt, 'ws-test');
        return false;
 
    };
 
    // get an item with local storage
    storage.get = function (key, opt) {
        opt = opt || {};
        opt.onDisabled = opt.onDisabled || function () {};
        // feature test for local storage
        if (test()) {
            var mess = localStorage.getItem(key);
            if (mess) {
                // try to parse as json and return an object
                try{
                    return JSON.parse(mess)
                }catch(e){
                    // if there is an error assume some other standard is being used
                    // and return a string
                    return mess;
                }
            } else {
                return '';
            }
        } else {
            opt.onDisabled.call(opt, opt, key);
        }
    };
 
    // set an item with local storage
    storage.set = function (key, value, opt) {
        opt = opt || {};
        opt.onDisabled = opt.onDisabled || function () {};
        if (test()) {
            // if typeof value is an object, then use JSON.strigify
            // to create a string, else assume that it is all ready a string
            if(typeof value === 'object'){
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        } else {
            opt.onDisabled.call(opt, opt, key);
        }
    };
 
}
    (this['Clucker'] === undefined ? this['storage'] = {} : Clucker['storage'] = {}));
