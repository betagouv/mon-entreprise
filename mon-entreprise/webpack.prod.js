/* eslint-env node */

import { HTMLPlugins, default as common } from './webpack.common'
import { commonLoaders, styleLoader } from '../webpack/common'

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import PrerenderSPAPlugin, { PuppeteerRenderer } from 'prerender-spa-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'

const Renderer = PuppeteerRenderer
import { resolve } from 'path'
import { load } from 'cheerio'
import MiniCssExtractPlugin, { loader } from 'mini-css-extract-plugin'
import TerserPlugin from 'terser-webpack-plugin'

const prerenderConfig = () => ({
	staticDir: resolve('dist'),
	renderer: new Renderer({
		renderAfterTime: 5000,
		skipThirdPartyRequests: true,
	}),
	postProcess: (context) => {
		const $ = load(context.html)
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
				#loading {
					display: none;
				}
			</style>
		`)
		// Remove piwik script
		$('script[src$="stats.data.gouv.fr/piwik.js"]').remove()

		context.html = $.html()
		return context
	},
})

export default {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader(loader)],
	},
	output: {
		...common.output,
		filename: ({ chunk }) => {
			return chunk.name === 'simulateur-iframe-integration'
				? '[name].js'
				: '[name].[contenthash].bundle.js'
		},
	},
	mode: 'production',
	devtool: 'source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: 2,
			}),
		],
	},
	plugins: [
		...common.plugins,
		...HTMLPlugins({ injectTrackingScript: true }),
		process.env.ANALYZE_BUNDLE && new BundleAnalyzerPlugin(),
		new GenerateSW({
			clientsClaim: true,
			skipWaiting: true,
			cacheId: process.env.HEAD,
			mode: process.env.HEAD === 'master' ? 'production' : 'developpement',
			swDest: 'sw.js',
			navigateFallback: '/fallback',
			navigateFallbackDenylist: [
				/^\/_.*$/,
				/.*\.map$/,
				/.*\?s=.*$/,
				/.*\.worker\.js/,
				/^\/robots\.txt$/,
				/^\/sitemap\.infrance\.fr\.txt$/,
				/^\/sitemap\.infrance\.en\.txt$/,
			],
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		}),
		process.env.ANALYZE_BUNDLE !== '1' &&
			new PrerenderSPAPlugin({
				...prerenderConfig(),
				outputDir: resolve('dist', 'prerender', 'infrance'),
				routes: ['/', '/calculators/salary', '/iframes/simulateur-embauche'],
				indexPath: resolve('dist', 'infrance.html'),
			}),
		process.env.ANALYZE_BUNDLE !== '1' &&
			new PrerenderSPAPlugin({
				...prerenderConfig(),
				outputDir: resolve('dist', 'prerender', 'mon-entreprise'),
				routes: [
					'/',
					'/simulateurs/salaire-brut-net',
					'/simulateurs/auto-entrepreneur',
					'/simulateurs/artiste-auteur',
					'/simulateurs/dirigeant-sasu',
					'/simulateurs/indépendant',
					'/simulateurs/chômage-partiel',
					'/créer',
					'/gérer',
					'/iframes/simulateur-embauche',
					'/iframes/simulateur-chomage-partiel',
					'/iframes/pamc',
				],
				indexPath: resolve('dist', 'mon-entreprise.html'),
			}),
	].filter(Boolean),
}
