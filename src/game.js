const network = require('./network');
const config = require('./config');
const {
  getBirdCenter,
  getBirdPosition,
  getBirdSize,
  getNextGap,
  isGameOver,
  shouldBirdJump
} = require('./utilities');

function getGameState() {
  const birdPosition = getBirdPosition();
  const nextGap = getNextGap(birdPosition.x);
  return {
    deltaX: nextGap.x - birdPosition.x,
    deltaY: nextGap.y + nextGap.height - birdPosition.y
  };
}

function mapStateToInputs(state) {
  return [state.deltaX, state.deltaY];
}

let iteration = 1;
let lastDeltaY = null;
function ticker() {
  if (isGameOver()) {
    console.log('Restarting. Iteration', ++iteration);
    const errorPropagateValue = lastDeltaY > 0 ? 0 : 1;
    network.propagate(config.ERROR_LEARNING_RATE, [errorPropagateValue]);
    window.restart();
    return window.handleJumpStart();
  }

  const gameState = getGameState();

  const tickPropagateValue = gameState.deltaY > 0 ? 0 : 1;
  network.propagate(config.TICK_LEARNING_RATE / 10, [tickPropagateValue]);
  lastDeltaY = gameState.deltaY;

  const inputs = mapStateToInputs(gameState);

  const output = network.activate(inputs)[0];
  if (shouldBirdJump(output)) {
    window.handleJumpStart();
  }
}

function start() {
  console.log('Starting. Iteration', iteration);
  window.handleJumpStart();

  setInterval(Game.ticker, config.TICK_INTERVAL);
}

module.exports = {
  ticker,
  start
};
