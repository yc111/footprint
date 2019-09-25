const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TersorWebpackPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin({}),
    ],
    optimization: {
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin(),
            new TersorWebpackPlugin()
        ]
    }
}