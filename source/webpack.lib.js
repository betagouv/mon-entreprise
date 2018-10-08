const common = require('./webpack.common.js')
const { universal } = require('./webpack.commonLoaders.js')
const path = require('path')

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
		rules: [
			...universal,
			{
				test: /\.css$/,
				use: [
					'isomorphic-style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			}
		]
	}
}
