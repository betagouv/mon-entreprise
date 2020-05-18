const { map } = require('ramda')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const prod = require('./webpack.prod')
const { HTMLPlugins } = require('./webpack.common')
const { commonLoaders, styleLoader } = require('../webpack/common')

const { EnvironmentPlugin } = require('webpack')

module.exports = {
	...prod,
	entry: map(entry => ['whatwg-fetch', entry], prod.entry),
	output: {
		filename: '[name].legacy.bundle.js'
	},
	module: {
		rules: [...commonLoaders({ legacy: true }), styleLoader('style-loader')]
	},
	plugins: [
		...HTMLPlugins({ injectTrackingScript: true }),
		new MonacoWebpackPlugin(),
		new EnvironmentPlugin({
			EN_SITE: '/infrance${path}',
			FR_SITE: '/mon-entreprise${path}'
		})
	]
}
