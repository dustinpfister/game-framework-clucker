# game-framework-clucker

This is a basic game framework based off of what I have made for my [blog post on the topic of a basic game framework](https://dustinpfister.github.io/2021/09/03/js-javascript-example-game-framework/) which is just one of my many JavaScript examples series of posts. The example started to get at least a little complex to the point that writing a single blog post on the source code would result in a blog post that is way to long. So I thought it would be a good idea to copy the source code for the framework, and then demos thus far into a stand alone repository and continue working on it there.


## Core Features of this game framework

I would like to keep this framework fairly basic and striped down to just a core set of features that I am actually going to use in one or more games that will be built on top of this foundation. For now the framework has the follow features in place that seem to work okay.

* A state machine
* A canvas library that supports: layers, built in points collection system, built in draw methods, a plugin system
* An object pool library for creating a collection of display objects aka sprites
* A general utility library with various methods used for bounding box, distance, ect

I will be adding at least a few additional features, but for the most part I will just be further improving and expanding the features that are all ready in place.