const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devServer: {
        port: 5000,
        compress: true,
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/assets', to: 'assets'}
        ])
    ]
}