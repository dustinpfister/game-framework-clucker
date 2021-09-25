# game-framework-clucker

This is a basic game framework based off of what I have made for my [blog post on the topic of a basic game framework](https://dustinpfister.github.io/2021/09/03/js-javascript-example-game-framework/). The example started to get at least a little complex to the point that writing a single blog post on the source code would result in a blog post that is way to long. So I thought it would be a good idea to copy the source code for the framework, and then demos thus far into a stand alone repository and continue working on it there.

## Setup, run the server, and building a version of clucker

For now there is just cloning down a copy of the repo, and then doing an npm install.

```
$ git clone --depth https://github.com/dustinpfister/game-framework-clucker
$ cd game-framework-clucker
$ npm install
```

### Run the sever to view the demos

To start the sever npm can be used with the run command like this.

```
$ npm run server
```

to run with a version of node other than what will result of the /usr/bin/env node shebang run the index.js file in the server-demo folder of the node folder.

```
$ node14 ./node/server-demo/index.js
```

### Build a version of clucker

To build the current version set in package json file the build script can be run with npm.

```
$ npm run build
```

## Core Features of this game framework

I would like to keep this framework fairly basic and striped down to just a core set of features that I am actually going to use in one or more games that will be built on top of this foundation. For now the framework has the follow features in place that seem to work okay.

### The general utilities library

A General utilities module is part of the framework. This library is a dumping ground for any and all methods that do not have some other location to which they would be placed better.

* An http client
* noop, distance, bounding box, and mathematical modulo
* A Basic exp system

### A Canvas Library

Of course this is going to have to have some kind of canvas library, with at least the basic set of features that such a librray should have.

* layers
* built in points collection system
* built in draw methods
* a plugin system

### An Object pool Library

Just about any kind of game is going to involve a collection of display objects.

* An object pool library for creating a collection of display objects aka sprites

### The Game frame module

There is then the game frame module where I have my state machine, main app loop, and built in states such as a loader state.

* A state machine


I will be adding at least a few additional features, but for the most part I will just be further improving and expanding the features that are all ready in place.