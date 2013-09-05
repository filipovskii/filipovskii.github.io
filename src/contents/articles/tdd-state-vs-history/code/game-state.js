exports.isNew = isNew;
exports.isStarted = isStarted;
exports.start = start;

var state = {};

function isNew(userId, gameId) {
  state[userId] = state[userId] || {};
  return !state[userId][gameId];
}

function isStarted(userId, gameId) {
  state[userId] = state[userId] || {};
  return state[userId][gameId] === 'start';
}

function start(userId, gameId) {
  state[userId] = state[userId] || {};
  state[userId][gameId] = 'start';
}


