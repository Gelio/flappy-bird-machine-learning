const network = require('./network');
const config = require('./config');

const gapGoalHeight = gap * 0.8;

function isGameOver() {
  return !!dead;
}

function getBirdX() {
  return bird.x + bird.spriteSheet._frameWidth / 2;
}

function getBirdY() {
  return bird.y + bird.spriteSheet._frameHeight / 2;
}

function getPipeEndX(pipe) {
  return pipe.x + pipe.image.width;
}

function findNearestPipe() {
  const pipes = window.pipes.children;

  if (pipes.length === 0) {
    return { x: getBirdX(), y: ground.y / 2 };
  }

  return pipes.reduce((nearest, next) => {
    if (getPipeEndX(next) > bird.x && next.x <= nearest.x && next.y < nearest.y) {
      return next;
    }

    return nearest;
  });
}

function getGameState() {
  const nearestPipe = findNearestPipe();
  const deltaX = nearestPipe.x - getBirdX();
  const deltaH = nearestPipe.y + gapGoalHeight - getBirdY();

  return {
    deltaX,
    deltaH,
    birdY: getBirdY()
  };
}

function mapStateToInputs(state) {
  return [state.deltaX, state.birdY, state.deltaH];
}

function shouldBirdJump(networkOutput) {
  return networkOutput >= config.JUMP_THRESHOLD;
}

let lastHeightDelta = null;
let iteration = 1;
function ticker() {
  if (isGameOver()) {
    console.log('Restarting. Iteration', ++iteration);
    const errorPropagateValue = lastHeightDelta > 0 ? 0 : 1;
    network.propagate(config.ERROR_LEARNING_RATE, [errorPropagateValue]);
    restart();
    return handleJumpStart();
  }

  const gameState = getGameState();

  const tickPropagateValue = gameState.deltaH > 0 ? 0 : 1;
  network.propagate(config.TICK_LEARNING_RATE / 10, [tickPropagateValue]);
  lastHeightDelta = gameState.deltaH;

  const inputs = mapStateToInputs(gameState);

  const output = network.activate(inputs)[0];
  if (shouldBirdJump(output)) {
    handleJumpStart();
  }
}

function start() {
  console.log('Starting. Iteration', iteration);
  handleJumpStart();

  setInterval(Game.ticker, config.TICK_INTERVAL);
}

module.exports = {
  ticker,
  start
};
