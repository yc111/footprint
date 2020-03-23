const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TersorWebpackPlugin = require('terser-webpack-plugin');

console.log(path.join(process.cwd()));
module.exports = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({}),
    function () {
      this.plugin('done', (stats) => {
        console.log('stats', stats);
      });
    },
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new TersorWebpackPlugin(),
    ],
  },
};
