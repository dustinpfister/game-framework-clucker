# server-demo

This is a script to just serve a demo by way of http rather than file prototcol.

## How to use

Call the main index.js file, if it is not exacutabule use chmod to make sure that it is. When calling the index.js file just an options port number can be given as an argument. The default port for the script is 8080.

```
$ chmod 777 index.js
$ ./index.js 8080
```

It is also possible to call the server script directly, just make sure you are passing the right arguments. For example if the current working path is the folder for the sever script somthing like this should work

```
$ node server.js ../../ 8080
```

Then go to a url like this in the browser

```
http://localhost:8080/demos/loader/index.html
```

replace loader with the desired demo in the demos folder