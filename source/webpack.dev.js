const { map } = require('ramda')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const { commonLoaders, styleLoader } = require('./webpack.commonLoaders')

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')]
	},
	mode: 'development',
	entry: map(entry => ['webpack-hot-middleware/client', entry], common.entry),
	plugins: [
		...common.plugins,
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new webpack.HotModuleReplacementPlugin()
	]
}
