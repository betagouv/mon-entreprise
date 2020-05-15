/* eslint-env node */

const path = require('path')
const { commonLoaders, styleLoader } = require('../webpack/common')

const common = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	mode: 'development',
	entry: path.resolve(__dirname, 'source', 'index.ts'),
	module: {
		rules: [...commonLoaders(), styleLoader('isomorphic-style-loader')]
	},
	externals:
		// Every non-relative module is external
		/^[a-z\-0-9]+$/
}

module.exports = [
	// Config for UMD export (browser / node)
	{
		...common,
		output: {
			filename: 'index.js',
			library: 'publicodes',
			libraryTarget: 'umd',
			globalObject: 'this'
		}
	}
]

// Config for esmodule export, not used here, since it conflict with css import.
// Maybe we should use styled-component everywhere, to simplify things

// const futurBuild = {
// 	...common,
// 	output: {
// 		path: path.resolve(__dirname, 'dist', 'es')
// 	},
// 	experiments: {
// 		outputModule: true
// 	}
// }
