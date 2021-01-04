import { map } from 'ramda'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

import prod, { entry as _entry } from './webpack.prod'
import { commonLoaders, styleLoader } from '../webpack/common'

import { EnvironmentPlugin } from 'webpack'

export default {
	...prod,
	entry: map((entry) => ['whatwg-fetch', entry], _entry),
	output: {
		filename: '[name].legacy.bundle.js',
	},
	module: {
		rules: [...commonLoaders({ legacy: true }), styleLoader('style-loader')],
	},
	plugins: [
		new MonacoWebpackPlugin(),
		new EnvironmentPlugin({
			GITHUB_REF: '',
			GITHUB_HEAD_REF: '',
			GITHUB_SHA: '',
		}),
		new EnvironmentPlugin({
			EN_SITE: '/infrance${path}',
			FR_SITE: '/mon-entreprise${path}',
		}),
	],
}
