const config = require('./config');

const getBirdPosition = () => ({
  x: bird.x,
  y: bird.y
});

const getBirdSize = () => ({
  width: bird.spriteSheet._frameWidth,
  height: bird.spriteSheet._frameHeight
});

function getBirdCenter() {
  const position = getBirdPosition();
  const size = getBirdSize();

  return {
    x: position.x + size.x / 2,
    y: position.y + size.y / 2
  };
}

function getNextGap(startX) {
  const pipes = window.pipes.children;

  if (pipes.length === 0) {
    const birdPosition = getBirdPosition();
    return {
      x: birdPosition.x + 100,
      y: ground.y / 2,
      width: config.PIPE_WIDTH,
      height: config.GAP_HEIGHT
    };
  }

  const nextPipe = pipes.reduce((nearest, next) => {
    if (next.x < startX || next.x > nearest.x || next.y > nearest.y) {
      return nearest;
    }

    return next;
  });

  return {
    x: nextPipe.x,
    y: nextPipe.y,
    width: config.PIPE_WIDTH,
    height: config.GAP_HEIGHT
  };
}

const isGameOver = () => !!window.dead;

const shouldBirdJump = result => result >= config.JUMP_THRESHOLD;

module.exports = {
  getBirdPosition,
  getBirdCenter,
  getBirdSize,
  getNextGap,
  isGameOver,
  shouldBirdJump
};
