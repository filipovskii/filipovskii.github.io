---
title: "JS TDD session: State vs. History"
author: filipovsky
date: 2013-09-05
template: article.jade
---

Things change over time. They evolve, mutate and regress throughout once
life cycle. Today I want to talk about keeping track of those changes, by
comparing two most common techniques: *state objects* and *history*.
<span class="more"/>

This post will be in a form of TDD session. First I will state a problem
and write a test for it, then try to solve it by writing implementation.
I will use the same approach as in my everyday job. All code will be in
javascript.

## Prerequisites

Before we dive into the coding process, here are tools I'll be using:
[node.js][node], [underscore][underscore], and [mocha][mocha] for testing.
If you're not familiar with *mocha* yet, you should probably take a quick
look [here][mocha]. If you don't know much about *node* or *underscore*,
but are comfortable with *javascript*, it's not a big deal, but I
definitely recommend to check it out.

You should also be familiar with [TDD][TDD]. There are lots of good books
and articles on this subject. [Test Driven Development by Example] [Kent
Beck] is great to start with.

## Task

Suppose you are implementing an app where user can play different games.
Each game has an id and a state you need to keep track of. Suppose game
can be **started**, **won** or **lost** (both last states also mean it is
**finished**). Initial state of a game, before user interactions, is
**new**.


## Project structure:

    .
    ├── README.markdown
    ├── game-history.js     -> *history*  implementation
    ├── game-state.js       -> *state*    implementation
    ├── node_modules
    │   └── underscore
    │       └── ...
    ├── package.json
    └── test
        └── test.js         -> test suite


## State implementation

First we will deal with **state implementation**. Initial assumption is
before any user interaction, game should be **new**. Here is a test for
that:

```javascript

  // ./test/test.js

  var assert = require('assert');

  describe('Game implemented via state', function () {
    var game = require('../game-state'),
        userId = 1,
        gameId = 1;

    it('has initial state of `new`', function () {
      assert(game.isNew(userId, gameId));
    });

  });

```

Launch tests in console with [mocha][mocha]:

    /path/to/project$ mocha

*By the way, you can make tests run every time you save a file with
*`mocha -w`.

And... it is failing:

      1 failing

      1) Game implemented via state has initial state of `new`:

       TypeError: Object #<Object> has no method 'isNew'
        at ...


Quickly add a simpliest implementation possible:

```javascript

  // ./game-state.js

  exports.isNew = isNew;

  function isNew() {
    return true;
  }

```

And mocha tells us we are done with this for now:

    1 passing


Moving forward. When user starts a game, it becomes **started**.
The Test:

```javascript
  // ./test/test.js

  it('changes to `started` on game start', function () {
    game.start(userId, gameId);

    assert(game.isStarted(userId, gameId));
    assert(!game.isNew(userId, gameId));
  });

```

It fails, with a similar TypeError, which is easy to fix:

```javascript
  // ./game-state.js

  exports.isStarted = isStarted;
  exports.start = start;

  function isStarted() { }
  function start() { }
```

Which brings us to AssertionError now:

      1 passing
      1 failing

      1) Game implemented via state changes to `started` on game start:
       AssertionError: "undefined" == true
       ...


So we create a storage for the state. Implement `isStarted` and `start`
functions and change `isNew` function, so
`assert(!game.isNew(userId, gameId))` does not fail.

```javascript
  // ./game-state.js

  var state = {};

  function isNew(userId, gameId) {

    // this will prevent fails when isNew()
    // is called for the user with no state
    state[userId] = state[userId] || {};

    return !state[userId][gameId];
  }

  function isStarted(userId, gameId) {
    state[userId] = state[userId] || {};
    return state[userId][gameId] === 'started';
  }

  function start(userId, gameId) {
    state[userId] = state[userId] || {};
    state[userId][gameId] = 'started';
  }
```

Now both our tests pass. We can start games like... everyday. Pretty cool,
I guess. But it would be even better if we could win a game! Yeah, that
sounds like something I've always wanted:

```javascript
  // ./test/test.js

  it('changes to `finished` on win', function () {
    game.start(userId, gameId);
    game.win(userId, gameId);

    assert(game.isStarted(userId, gameId));
    assert(game.isFinished(userId, gameId));
    assert(game.isWon(userId, gameId));
    assert(!game.isLost(userId, gameId));

  });
```

Moving quickly (under the hood I make it first fail with AssertionError,
than provide implementation) leads me to this:

```javascript
  // ./game-state.js

  exports.isFinished = isFinished;
  exports.isWon = isWon;
  exports.win = win;


  function isFinished(userId, gameId) {
    return isWon(userId, gameId) || isLost(userId, gameId);
  }


  function isLost(userId, gameId) {
    state[userId] = state[userId] || {};
    return state[userId][gameId] === 'lost';
  }


  function isStarted(userId, gameId) {
    state[userId] = state[userId] || {};
    // consider every finished game was started once...
    return _.contains([ "started", "won", "lost" ], state[userId][gameId]);
  }


  function isWon(userId, gameId) {
    state[userId] = state[userId] || {};
    return state[userId][gameId] === 'won';
  }


  function win(userId, gameId) {
    state[userId] = state[userId] || {};
    state[userId][gameId] = 'won';
  }
```

Loosing a game is pretty similar to winning, in terms of code, so I leave
it up to you to imaging.


## History implementation. Comparison

Using same tests (which is kinda great), I've made a *history*-based
implementation of the solution for the same problem. Idea behind it is:
"Save every action user makes in a list. Every time game
state is requested, calculate it based on data about what actions user
made."

Let's compare those two implementations.

**TEST**

```javascript
  it('has initial state of `new`', function () {
    assert(game.isNew(userId, gameId));
  });
```

**STATE impl**

```javascript
  var state = {};

  function isNew(userId, gameId) {
    state[userId] = state[userId] || {};
    return !state[userId][gameId];
  }
```

**HISTORY impl**

```javascript
  var history = [];

  function isNew(userId, gameId) {
    // check if user have made *any* actions
    return !_.any(history, function (h) {
      return h.userId === userId && h.gameId === gameId;
    });
  }
```

Those two are pretty similar. Time complexity of **state impl** will be
`O(1)`, because all we need to do is to look up values in two dictionaries
(js objects). For the **history impl** it is `O(n)`, where n is a number
of events. That's because we need to iterate through all of the events
until we find one with `userId` and `gameId` similar to what was given.

Next test is about changing a state of the game:

**TEST**

```javascript
  it('changes to `started` on game start', function () {
    game.start(userId, gameId);

    assert(game.isStarted(userId, gameId));
    assert(!game.isNew(userId, gameId));
  });
```

**STATE impl**

```javascript
  function start(userId, gameId) {
    state[userId] = state[userId] || {};
    state[userId][gameId] = 'started';
  }

  function isStarted(userId, gameId) {
    state[userId] = state[userId] || {};
    return _.contains([ "started", "won", "lost" ], state[userId][gameId]);
  }
```

**HISTORY impl**

```javascript
  function start(userId, gameId) {
    history.push({
      userId: userId,
      gameId: gameId,
      action: 'start'
    });
  }


  function isStarted(userId, gameId) {
    return _.any(history, function (h) {
      return (
        h.userId === userId &&
        h.gameId === gameId &&
        h.action === 'start'
      )
    });
  }
```

To change a game state using **state impl** you need to change one value
in a dictionary. To change game state using **history impl**, you add an
action to array. Depending on how `Array.push()` works, **history impl**
may take `O(1) or O(n)` time to do this. `isStarted()` takes same amount
of time as `isNew()`.


## To summarize

    u - number of users
    g - number of games
    e - number of events

    Implementation  | Operation  |  Time
    ----------------|------------|--------------
    state           |check state |  O(1)
    history         |check state |  O(e)
    state           |change state|  O(1)
    history         |change state|  O(1) or O(e)

    Implementation  | Space Required
    ----------------|---------------
    state           | O(u*g)
    history         | O(e)


In a real world `state` object we were using for **state impl** and
`history` array can be replaced with tables (collections) in database.


Although from performance point of view **state impl** is slightly better
than **history impl**, the latter has an obvious advantage in storing
additional info, e.g. the time of the state transition or user score,
together with the action itself.

I personally tend to use **history impl**-like solutions more often.
Especially when it comes to implementing something with unclear
requirements. And it is great to use **state impl** solutions for
caching purposes in case you are not satisfied with `O(e)` time of check
state.


You can find the code for this article [here] [code].

More examples of tests in javascript are on github:

 - [express] [express]
 - [q] [q]
 - [underscore] [underscore test]


That's it, thanks for your time!


[code]: https://github.com/filipovskii/filipovskii.github.io/tree/article/tdd-state-vs-history/src/contents/articles/tdd-state-vs-history/code
[express]: https://github.com/visionmedia/express/tree/master/test
[TDD]: http://en.wikipedia.org/wiki/Test-driven_development
[Kent Beck]: http://www.amazon.com/Test-Driven-Development-By-Example/dp/0321146530/ref=sr_1_1?ie=UTF8&qid=1378370467&sr=8-1&keywords=kent+beck+test+driven+development+by+example
[mocha]: http://mocha.com
[node]: http://nodejs.org/
[q]: https://github.com/kriskowal/q/tree/master/spec
[underscore test]: https://github.com/jashkenas/underscore/tree/master/test
[underscore]: http://underscorejs.org/
