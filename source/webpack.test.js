var webpack = require('webpack'),
	path = require('path'),
	HardSourceWebpackPlugin = require('hard-source-webpack-plugin'),
	common = require('./webpack.common.js')

module.exports = {
	...common,
	mode: 'development',
	plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })]
}
