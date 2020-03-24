const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 5000,
    compress: true,
    contentBase: path.resolve(__dirname, 'dist'),
  },
};
