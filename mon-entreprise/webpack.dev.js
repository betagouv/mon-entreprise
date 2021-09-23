/* eslint-env node */

const { map } = require('ramda')
const webpack = require('webpack')
const {
	HTMLPlugins,
	styleLoader,
	commonLoaders,
	default: common,
} = require('./webpack.common')

module.exports = {
	...common,
	node: {
		// This seems necessary to prevent a "Module not found: 'fs'" error when
		// launching mocha-webpack:
		fs: 'empty',
	},
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')],
	},
	watchOptions: {
		aggregateTimeout: 600,
	},
	mode: 'development',
	entry: map((entry) => ['webpack-hot-middleware/client', entry], common.entry),
	plugins: [
		...common.plugins,
		...HTMLPlugins(),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
			REDUX_TRACE: false,
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
}
