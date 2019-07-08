const { map } = require('ramda')
const webpack = require('webpack')
const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common
} = require('./webpack.common.js')

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')]
	},
	mode: 'development',
	entry: map(entry => ['webpack-hot-middleware/client', entry], common.entry),
	plugins: [
		...common.plugins,
		...HTMLPlugins(),
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new webpack.HotModuleReplacementPlugin()
	]
}
