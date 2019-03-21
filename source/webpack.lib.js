const common = require('./webpack.common.js')
const path = require('path')
const { commonLoaders, styleLoader } = require('./webpack.commonLoaders')

module.exports = {
	resolve: common.resolve,
	entry: './source/engine/index.js',
	mode: 'development',
	devtool: 'source-map',
	output: {
		path: path.resolve('./dist/'),
		filename: 'engine.js',
		library: 'Syso',
		libraryTarget: 'umd',
		globalObject: "(typeof window !== 'undefined' ? window : this)"
	},
	module: {
		rules: [...commonLoaders(), styleLoader('isomorphic-style-loader')]
	}
}
