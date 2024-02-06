// Development mode webpack configuration


// ====== IMPORTS ======

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');


// ====== CONFIGURATION ======

module.exports = merge(common, {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
});