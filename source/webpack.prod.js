const common = require('./webpack.common.js')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
	...common,
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		...common.plugins,
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
			swDest: 'sw.js',
			navigateFallback: '/',
			navigateFallbackBlacklist: [/.*\?s=.*$/, /^\/stats/],
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
