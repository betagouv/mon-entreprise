/* eslint-env node */

const path = require('path')
const { commonLoaders } = require('../webpack/common')

const common = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	mode: 'development',
	entry: path.resolve(__dirname, 'source', 'index.ts'),
	module: {
		rules: commonLoaders({ file: false })
	},
	externals:
		// Every non-relative module is external
		/^[a-z\-0-9]+$/
}

module.exports =
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
