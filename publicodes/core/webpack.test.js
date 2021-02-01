const { EnvironmentPlugin } = require('webpack')
const config = require('./webpack.config')

module.exports = {
	...config[0],
	externals: [],
	target: 'node',
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
