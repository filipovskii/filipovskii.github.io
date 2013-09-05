exports.clear = clear;

exports.isFinished = isFinished;
exports.isLost = isLost;
exports.isNew = isNew;
exports.isStarted = isStarted;
exports.isWon = isWon;

exports.start = start;
exports.win = win;

var state = {},
    _ = require('underscore');


function clear() {
  _.chain(state).keys().forEach(function (key) {
    delete state[key];
  });
}


function isFinished(userId, gameId) {
  return isWon(userId, gameId) || isLost(userId, gameId);
}


function isLost(userId, gameId) {
  state[userId] = state[userId] || {};
  return state[userId][gameId] === 'lost';
}


function isNew(userId, gameId) {
  state[userId] = state[userId] || {};
  return !state[userId][gameId];
}


function isStarted(userId, gameId) {
  state[userId] = state[userId] || {};
  return _.contains([ "started", "won", "lost" ], state[userId][gameId]);
}


function isWon(userId, gameId) {
  state[userId] = state[userId] || {};
  return state[userId][gameId] === 'won';
}


function lose(userId, gameId) {
  state[userId] = state[userId] || {};
  state[userId][gameId] = 'lost';
}

function start(userId, gameId) {
  state[userId] = state[userId] || {};
  state[userId][gameId] = 'started';
}

function win(userId, gameId) {
  state[userId] = state[userId] || {};
  state[userId][gameId] = 'won';
}
