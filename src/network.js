const synaptic = require('synaptic');
const config = require('./config');

module.exports = new synaptic.Architect.Perceptron(
  3,
  ...config.HIDDEN_LAYERS,
  1
);
