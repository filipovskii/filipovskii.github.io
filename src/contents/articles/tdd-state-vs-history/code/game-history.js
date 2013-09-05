exports.clear = clear;

exports.isFinished = isFinished;
exports.isLost = isLost;
exports.isNew = isNew;
exports.isStarted = isStarted;
exports.isWon = isWon;

exports.start = start;
exports.win = win;

var _ = require('underscore'),
    history = [];


function isNew(userId, gameId) {
  return !_.any(history, function (h) {
    return h.userId === userId && h.gameId === gameId;
  });
}


function clear() {
  while (history.pop()) { }
}


function start(userId, gameId) {
  history.push({
    userId: userId,
    gameId: gameId,
    action: 'start'
  });
}


function win(userId, gameId) {

  if (!isStarted(userId, gameId)) {
    throw new Error('Game was not started!');
  }

  history.push({
    userId: userId,
    gameId: gameId,
    action: 'win'
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

function isFinished(userId, gameId) {
  return isWon(userId, gameId) || isLost(userId, gameId);
}


function isWon(userId, gameId) {
  return _.any(history, function (h) {
    return (
      h.userId === userId &&
      h.gameId === gameId &&
      h.action === 'win'
    )
  });
}


function isLost(userId, gameId) {
  return _.any(history, function (h) {
    return (
      h.userId === userId &&
      h.gameId === gameId &&
      h.action === 'lose'
    )
  });

}
