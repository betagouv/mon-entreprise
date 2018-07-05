const common = require('./webpack.common.js')
const HTMLPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
	...common,
	mode: 'production',
	entry: {
		bundle: ['@babel/polyfill', 'whatwg-fetch', './source/entry.js'],
		// le nom "simulateur" est là pour des raisons historiques
		//
		simulateur: './source/iframe-script.js',
		'colour-chooser': ['@babel/polyfill', './source/entry-colour-chooser.js']
	},
	plugins: [
		new HTMLPlugin({
			template: 'example-integration.html',
			chunks: ['simulateur']
		}),
		...common.plugins,
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
			// chunks: ['bundle'],
			swDest: 'sw.js',
			navigateFallback: '/index.html',
			runtimeCaching: [
				{
					urlPattern: new RegExp(
						'https://fonts.(?:googleapis|gstatic).com/(.*)|https://cdn.polyfill.io/v2/polyfill.min.js'
					),
					handler: 'cacheFirst',
					options: {
						cacheName: 'google-fonts',
						expiration: {
							maxEntries: 5
						},
						cacheableResponse: {
							statuses: [0, 200]
						}
					}
				}
			]
		})
	]
}
