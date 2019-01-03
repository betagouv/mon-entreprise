var webpack = require('webpack'),
	common = require('./webpack.common.js')

module.exports = {
	...common,
	target: 'node',
	mode: 'development',
	devtool: 'inline-cheap-module-source-map',
	output: {
		// use absolute paths in sourcemaps (important for debugging via IDE)
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
	},
	plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })]
}
