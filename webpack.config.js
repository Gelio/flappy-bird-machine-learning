const path = require('path');

module.exports = {
  entry: './src/game',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'Game'
  }
};
