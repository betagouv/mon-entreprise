const path = require('path')
const { commonLoaders, styleLoader } = require('./webpack.common')

module.exports = {
	entry: './source/engine/index.js',
	mode: 'development',
	devtool: 'source-map',
	output: {
		path: path.resolve('./dist/'),
		filename: 'index.js',
		library: 'Syso',
		libraryTarget: 'umd',
	},
	module: {
		rules: [...commonLoaders(), styleLoader('isomorphic-style-loader')],
	},
}
