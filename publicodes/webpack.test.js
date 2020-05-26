const { commonLoaders } = require('../webpack/common')
const { EnvironmentPlugin } = require('webpack')

module.exports = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	output: {
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
		devtoolModuleFilenameTemplate: '[absolute-resource-path]'
	},
	mode: 'development',
	module: {
		rules: [
			...commonLoaders(),
			{
				test: /\.css$/,
				use: ['css-loader', 'postcss-loader']
			}
		]
	},
	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: 'test'
		})
	]
}
