const common = require('./webpack.common.js')
const WorkboxPlugin = require('workbox-webpack-plugin')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const path = require('path')
const cheerio = require('cheerio')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const prerenderConfig = () => ({
	staticDir: path.resolve('dist'),
	renderer: new Renderer({
		renderAfterTime: 5000,
		skipThirdPartyRequests: true
	}),
	postProcess: context => {
		const $ = cheerio.load(context.html)
		// force https on twitter emoji cdn
		$('img[src^="http://twemoji.maxcdn.com"]').each((i, el) => {
			$(el).attr('src', (_, path) => path.replace('http://', 'https://'))
		})
		// Remove loader
		$('#outdated-browser').after(`
			<style>
				#js {
					opacity: 1;
					transform: translateY(0px);
				}
				#lds-ellipsis {
					display: none;
				}
			</style>
		`)
		// Remove piwik script
		$('script[src$="stats.data.gouv.fr/piwik.js"]').remove()
		context.html = $.html()
		return context
	}
})
// Replace style-loader with MiniCssExtractPlugin.loader
common.module.rules
	.find(rule => rule.test.test('a.css'))
	.use.find(loader => loader.loader === 'style-loader').loader =
	MiniCssExtractPlugin.loader

module.exports = {
	...common,
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css'
		}),
		...common.plugins,
		new WorkboxPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
			swDest: 'sw.js',
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
			],
			navigateFallback: '/fallback',
			navigateFallbackWhitelist: [/^\/[^_]+$/], // fallback for anything that doesn't start with
			navigateFallbackBlacklist: [
				/.*\?s=.*$/,
				/^\/stats/,
				/^\/robots\.txt$/,
				/^\/sitemap\.infrance\.fr\.txt$/,
				/^\/sitemap\.infrance\.en\.txt$/
			]
		}),
		new PrerenderSPAPlugin({
			...prerenderConfig(),
			outputDir: path.resolve('dist', 'prerender', 'infrance'),
			routes: ['/'],
			indexPath: path.resolve('dist', 'infrance.html')
		}),
		new PrerenderSPAPlugin({
			...prerenderConfig(),
			outputDir: path.resolve('dist', 'prerender', 'mon-entreprise'),
			routes: ['/'],
			indexPath: path.resolve('dist', 'mon-entreprise.html')
		}),
		new PrerenderSPAPlugin({
			...prerenderConfig(),
			outputDir: path.resolve('dist', 'prerender', 'embauche'),
			routes: ['/'],
			indexPath: path.resolve('dist', 'embauche.html')
		})
	]
}
