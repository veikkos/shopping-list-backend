const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry: {
    'dist/products': path.resolve(__dirname, 'products/index.js'),
    'dist/lists': path.resolve(__dirname, 'lists/index.js'),
    'dist/shared': path.resolve(__dirname, 'shared/index.js'),
    'dist/preflight': path.resolve(__dirname, 'preflight/index.js'),
  },
  output: {
    path: __dirname,
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
};