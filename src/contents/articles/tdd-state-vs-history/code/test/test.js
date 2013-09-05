var assert = require('assert');

describe('Game implemented via history', function () {
  var game = require('../game-history'),
      userId = 1,
      gameId = 1;

  beforeEach(function () {
    game.clear();
  });

  it('has initial state of `new`', function () {
    var userId = 1,
        gameId = 1;

    assert.ok(game.isNew(userId, gameId));
  });

  it('changes to `started` on game start', function () {
    game.start(userId, gameId);

    assert.ok(game.isStarted(userId, gameId));
    assert.ok(!game.isNew(userId, gameId));
  });

  it('changes to `finished` on win', function () {
    game.start(userId, gameId);
    game.win(userId, gameId);

    assert.ok(game.isStarted(userId, gameId));
    assert.ok(game.isFinished(userId, gameId));
    assert.ok(game.isWon(userId, gameId));
    assert.ok(!game.isLost(userId, gameId));

  });

  it('can`t win a game if it was not started', function () {
    assert.throws(function () { game.win(userId, gameId); });
  });

});

describe('Game implemented via state', function () {
  var game = require('../game-state'),
      userId = 1,
      gameId = 1;

  beforeEach(function () {
    game.clear();
  });

  it('has initial state of `new`', function () {
    var userId = 1,
        gameId = 1;

    assert.ok(game.isNew(userId, gameId));
  });

  it('changes to `started` on game start', function () {
    game.start(userId, gameId);

    assert.ok(game.isStarted(userId, gameId));
    assert.ok(!game.isNew(userId, gameId));
  });

  it('changes to `finished` on win', function () {
    game.start(userId, gameId);
    game.win(userId, gameId);

    assert.ok(game.isStarted(userId, gameId), 'game is not started');
    assert.ok(game.isFinished(userId, gameId));
    assert.ok(game.isWon(userId, gameId));
    assert.ok(!game.isLost(userId, gameId));

  });

});
