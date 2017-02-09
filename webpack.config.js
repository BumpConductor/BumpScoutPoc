module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'bundle.js',
    path: './ui/app',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  devtool: 'eval-source-map',
};
