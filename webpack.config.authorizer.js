const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    'dist/authorizer': path.resolve(__dirname, 'authorizer/index.js'),
  },
  output: {
    path: __dirname,
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  mode: 'production',
};