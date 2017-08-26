const reinforceJS = require('reinforcenode');
const config = require('./config');

const env = {
  getNumStates() {
    return 2;
  },

  getMaxNumActions() {
    return 2;
  }
}

const spec = {
  alpha: config.ALPHA
};

module.exports = new reinforceJS.DQNAgent(env, spec);
