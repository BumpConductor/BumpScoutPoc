var path = require('path');
module.exports = {
  entry: './app/index.js',
  output: {
    sourceMapFilename: 'bundle.js.map',
    filename: 'bundle.js',
    path: path.resolve(__dirname, './ui/app'),
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  devtool: 'source-map',
};
