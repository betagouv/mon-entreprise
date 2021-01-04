/* eslint-env node */
import { map } from 'ramda'
import Webpack from 'webpack'
import { commonLoaders, styleLoader } from '../webpack/common.mjs'
import { HTMLPlugins, default as common } from './webpack.common.js'

export default {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader('style-loader')],
	},
	mode: 'development',
	entry: map((entry) => ['webpack-hot-middleware/client', entry], common.entry),
	plugins: [
		...common.plugins,
		...HTMLPlugins(),
		new Webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new Webpack.HotModuleReplacementPlugin(),
	],
}
