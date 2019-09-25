const path = require('path');

module.exports = {
    mode: 'development',
    devServer: {
        port: 5000,
        compress: true,
        contentBase: path.resolve(__dirname, 'dist')
    }
}