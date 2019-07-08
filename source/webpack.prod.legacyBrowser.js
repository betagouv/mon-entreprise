const { map } = require('ramda')
const prod = require('./webpack.prod.js')
const {
	commonLoaders,
	styleLoader,
	HTMLPlugins
} = require('./webpack.common.js')

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
		new EnvironmentPlugin({
			EN_SITE: '/infrance${path}',
			FR_SITE: '/mon-entreprise${path}'
		})
	]
}
