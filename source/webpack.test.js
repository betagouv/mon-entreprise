const webpack = require('webpack')
const {
	default: common,
	commonLoaders,
	styleLoader
} = require('./webpack.common')

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')]
	},
	mode: 'development',
	plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })]
}
