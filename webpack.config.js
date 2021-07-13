const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry: {
    'dist/products/index': path.resolve(__dirname, 'products/index.js'),
    'dist/lists/index': path.resolve(__dirname, 'lists/index.js'),
    'dist/shared/index': path.resolve(__dirname, 'shared/index.js'),
    'dist/preflight/index': path.resolve(__dirname, 'preflight/index.js'),
  },
  output: {
    path: __dirname,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: [],
  mode: 'production',
};