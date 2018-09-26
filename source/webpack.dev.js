const { map, concat } = require('ramda')
const webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = {
	...common,
	mode: 'development',
	entry: map(concat(['webpack-hot-middleware/client']), common.entry),
	plugins: [
		...common.plugins,
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new webpack.HotModuleReplacementPlugin()
	]
}
