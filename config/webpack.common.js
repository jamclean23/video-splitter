// Common webpack configuration

// ====== IMPORTS ======

// System
const path = require('path');

// File manager
const FileManagerPlugin = require('filemanager-webpack-plugin');

// Functions
const getDirs = require('./functions/getDirs.js');
const buildEntriesObj = require('./functions/buildEntriesObj.js');


// ====== GLOBAL VARS ======

const entryFolders = getDirs(path.join(__dirname, '../src'));
const entryObj = buildEntriesObj(entryFolders);


// ====== CONFIGURATION ======

module.exports = {
    entry: entryObj,
    output: {
        filename: '[name].bundle.js',
        publicPath: '../../bundles/',
        path: path.resolve(__dirname, '../bundles'),
        assetModuleFilename: (pathData) => {
            const issuer = pathData.module.resourceResolveData.context.issuer;
            let issuerPath;
            if (issuer.includes('/')) {
                issuerPath = issuer.split('/').slice(-2, -1)[0];
            } else {
                issuerPath = issuer.split('\\').slice(-2, -1)[0];
            }
            return issuerPath + '/assets/[hash][ext]'
        },
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource'
            }
        ]
    },
    plugins: [
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: [
                        path.join(__dirname, '../bundles')
                    ]
                },
                // FOR COPYING HTML FROM SRC TO BUNDLES
                // onEnd: {
                //     copy: [
                //         {
                //             source: path.join(__dirname, '../src/**/*.html'),
                //             destination: path.join(__dirname, '../bundles/')
                //         }
                //     ]
                // },
            }
        })
    ]
}
