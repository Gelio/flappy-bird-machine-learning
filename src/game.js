const agent = require('./agent');
const config = require('./config');
const {
  getBirdPosition,
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
let justRestarted = true;
function ticker() {
  if (isGameOver()) {
    console.log('Restarting. Iteration', ++iteration);
    agent.learn(config.EXPERIENCE_ON_FAILURE);
    justRestarted = true;
    window.restart();
    return window.handleJumpStart();
  }

  if (justRestarted) {
    justRestarted = false;
  } else {
    agent.learn(config.EXPERIENCE_ON_SUCCESS_TICK);
  }

  const gameState = getGameState();
  const inputs = mapStateToInputs(gameState);
  const output = agent.act(inputs);
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
