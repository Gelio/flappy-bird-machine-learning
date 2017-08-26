const agent = require('./agent');
const config = require('./config');
const {
  getBirdPosition,
  getNextGap,
  isGameOver,
  shouldBirdJump,
  getScore
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
let lastScore = getScore();
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
    const currentScore = getScore();
    if (currentScore > lastScore) {
      agent.learn(config.EXPERIENCE_ON_SUCCESS);
      lastScore = currentScore;
    } else if (getBirdPosition().y <= 0) {
      agent.learn(config.EXPERIENCE_ON_FAILURE);
    }
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
