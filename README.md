# game-framework-clucker

This is a game framework based off of what I have made for my [blog post on the topic of a basic game framework](https://dustinpfister.github.io/2021/09/03/js-javascript-example-game-framework/). The example started to get at least a little complex to the point that writing a single blog post on the source code would result in a blog post that is way to long. So I thought it would be a good idea to copy the source code for the framework, and the demos thus far, into a stand alone repository and continue working on it there.

Thus far I have a few demos that are starting to look like finished games, but I think that I still need to put a little more work into thus thing before I start publishing any kind of real project based off of this. There is not just adding more features to the core of what the framework is, but also expanding the collection of additional options javaScript files that I can just grap at for various things. I am sure that I am also going to want to expand the collection of nodejs scripts as I start to turn this project into something more than just another game framework.

## Development

As of 0.8.0 I am now thinking in terms of just revision numbers as I move forward with this, and maybe only putting out a new revision once every one to three months. In other words just bumping the minor number forward and technically staying in a state of perpetual alpha, as I am still not fully sure what the public API of the Clucker core should be, and I am also not sure as to what the general direction is with this project just yet.

## 1 - Setup, run the server, and building a version of clucker

For now there is just cloning down a copy of the repo, and then doing an npm install.

```
$ git clone --depth https://github.com/dustinpfister/game-framework-clucker
$ cd game-framework-clucker
$ npm install
```

### 1.1 - Run the sever to view the demos

To start the sever npm can be used with the run command like this.

```
$ npm run server
```

to run with a version of node other than what will result of the /usr/bin/env node shebang run the index.js file in the server-demo folder of the node folder.

```
$ node14 ./node/server-demo/index.js
```

### 1.2 - Build a version of clucker

To build the current version set in package json file the build script can be run with npm.

```
$ npm run build
```

## 2 - The /css folder

A css folder that contains css that should be used with Clucker.

## 3 - The /demos folder

Project demos of Clucker, some of which are very simple projects just for the sake of testing out a feature while others are starting to look like a final product of some kind.

## 4 - The /dist folder

This is where I have builts of the Clucker core javaScript file.

## 5 - The /js folder

The root js folder of this project is where I am storing additonal javaScript projects that I am using with the various demos thus far. For now this is just where I am parking additional javaScript modules that I may or may not intergrate into the core of what Clucker is thus far. I suppose it is also possible for things that are part of the core of Clucker now to end up being stored in here rather than built into Clucker itself.


## 6 - The /lib folder - Core Features of this game framework

I would like to keep this framework fairly basic and striped down to just a core set of features that I am actually going to use in one or more games that will be built on top of this foundation. For now the framework has the follow features in place that seem to work okay.

### 6.1 - A Canvas Library

Of course this is going to have to have some kind of canvas library, with at least the basic set of features that such a librray should have.

* layers
* built in points collection system
* built in draw methods
* a plugin system

### 6.2 - The Game frame module

There is then the game frame module where I have my state machine, main app loop, and built in states such as a loader state.

* A state machine


I will be adding at least a few additional features, but for the most part I will just be further improving and expanding the features that are all ready in place.

### 6.3 - An Object pool Library

Just about any kind of game is going to involve a collection of display objects.

* An object pool library for creating a collection of display objects aka sprites

### 6.4 - Storage Library

In Clucker 0.7.0 I added a storage library that is the built in way to save and load game states

### 6.5 - Upgrades Library

In Clucker 0.6.0 I added an upgrades library to provide a built in way to have upgrades for games

### 6.6 - The general utilities library

A General utilities module is part of the framework. This library is a dumping ground for any and all methods that do not have some other location to which they would be placed better.

* An http client
* noop, distance, bounding box, and mathematical modulo
* A Basic exp system

## 7 - The /node folder

The node folder is where I have a few scripts that run with nodejs to prefom certin tasks such as having a basic sever to host the demos of http, and to create a build.



