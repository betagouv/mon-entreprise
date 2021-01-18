const { EnvironmentPlugin } = require('webpack')
const prodConfig = require('./webpack.config')

module.exports = {
	...prodConfig,
	mode: 'development',
	output: {
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
	},
	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: 'test',
		}),
	],
}
