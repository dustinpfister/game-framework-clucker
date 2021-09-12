# pool.js - An Object Pool Library

This is an object pool librray based off of what I worked out for my canvas example on the project starting with 0.4.0 from that project folder.

## Basic use example

```js
// to create an object pool with default hard coded settings
var pool = poolMod.create();
console.log( pool.objects.length ) // 10
console.log( JSON.stringify( pool.objects[0] ) );
// {"active":false,"i":0,"x":0,"y":0,"w":32,"h":32,"heading":0,"pps":32,"lifespan":3,"data":{}}
```