const synaptic = require('synaptic');
const config = require('./config');

const inputLayer = new synaptic.Layer(3);
const hiddenLayers = config.HIDDEN_LAYERS.map(
  neuronsCount => new synaptic.Layer(neuronsCount)
);
const outputLayer = new synaptic.Layer(1);

[inputLayer, ...hiddenLayers, outputLayer].reduce((previous, next) => {
  previous.project(next);
  return next;
});

const network = new synaptic.Network({
  input: inputLayer,
  hidden: hiddenLayers,
  output: outputLayer
});

module.exports = network;
