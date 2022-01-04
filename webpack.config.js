const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry: {
    'dist/products': path.resolve(__dirname, 'products/index.js'),
    'dist/lists': path.resolve(__dirname, 'lists/index.js'),
    'dist/shared': path.resolve(__dirname, 'shared/index.js'),
  },
  output: {
    path: __dirname,
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [nodeExternals()],
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FRONTEND_URI': JSON.stringify(process.env.FRONTEND_URI),
      'process.env.ALTERNATIVE_URI': JSON.stringify(process.env.ALTERNATIVE_URI),
      'process.env.AUDIENCE': JSON.stringify(process.env.AUDIENCE),
      'process.env.ISSUER': JSON.stringify(process.env.ISSUER),
      'process.env.JWKS_URI': JSON.stringify(process.env.JWKS_URI),
    }),
  ],
};