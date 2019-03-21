var webpack = require('webpack'),
	common = require('./webpack.common.js'),
	{ commonLoaders, styleLoader } = require('./webpack.commonLoaders')

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')]
	},
	mode: 'development',
	plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })]
}
