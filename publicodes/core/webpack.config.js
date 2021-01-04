/* eslint-env node */
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { commonLoaders } from '../../webpack/common'

const common = {
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	mode: process.env.NODE_ENV,
	entry: resolve(fileURLToPath(import.meta.url), 'source', 'index.ts'),
	module: {
		rules: commonLoaders({ file: false }),
	},
}

export default [
	// Config for UMD export (browser / node)
	{
		...common,
		output: {
			filename: 'index.js',
			library: 'publicodes',
			libraryTarget: 'umd',
			globalObject: 'this',
		},
		externals:
			// Every non-relative module is external
			/^[a-z\-0-9]+$/,
	},
	process.env.NODE_ENV === 'production' && {
		...common,
		output: {
			filename: 'publicodes.min.js',
			library: 'publicodes',
			libraryTarget: 'global',
		},
	},
].filter(Boolean)
