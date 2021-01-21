/* eslint-env node */

const path = require('path')

const babelLoader = {
	loader: 'babel-loader',
	options: {
		cacheDirectory: true,
		rootMode: 'upward',
		presets: [
			[
				'@babel/preset-env',
				{
					targets: {
						esmodules: true,
					},
					useBuiltIns: 'entry',
					corejs: '3',
				},
			],
		],
	},
}
const common = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	mode: process.env.NODE_ENV ?? 'development',
	entry: path.resolve(__dirname, 'source', 'index.ts'),
	module: {
		rules: [
			{
				test: /\.(js|ts|tsx)$/,
				use: babelLoader,
				exclude: /node_modules|dist/,
			},
			{
				test: /\.ne$/,
				use: [babelLoader, 'nearley-loader'],
			},
			{
				test: /\.yaml$/,
				use: ['json-loader', 'yaml-loader'],
			},
		],
	},
}

const output =
	process.env.NODE_ENV === 'production'
		? {
				filename: 'publicodes.min.js',
				library: 'publicodes',
				libraryTarget: 'global',
		  }
		: {
				filename: 'index.js',
				library: 'publicodes',
				libraryTarget: 'umd',
				globalObject: 'this',
		  }

module.exports = {
	...common,
	output,
}
