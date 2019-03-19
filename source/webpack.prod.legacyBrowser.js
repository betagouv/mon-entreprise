const { map } = require('ramda')
const prod = require('./webpack.prod.js')
const { commonLoaders, styleLoader } = require('./webpack.commonLoaders')
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
		new EnvironmentPlugin({
			EN_SITE: '/infrance${path}',
			FR_SITE: '/mon-entreprise${path}'
		})
	]
}
