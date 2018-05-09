var webpack = require('webpack'),
	common = require('./webpack.common.js')

module.exports = {
	...common,
	mode: 'development',
	plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })]
}
