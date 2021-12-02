/* eslint-env node */

const {
	HTMLPlugins,
	styleLoader,
	commonLoaders,
	default: common,
} = require('./webpack.common')

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const PrerenderSPAPlugin = require('prerender-spa-plugin')

const Renderer = PrerenderSPAPlugin.PuppeteerRenderer
const path = require('path')
const cheerio = require('cheerio')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const prerenderConfig = {
	staticDir: path.resolve('dist'),
	renderer: new Renderer({
		renderAfterTime: 5000,
		inject: true,
		skipThirdPartyRequests: true,
	}),
	postProcess: (context) => {
		const $ = cheerio.load(context.html)
		// Remove loader
		$('#outdated-browser').after(`
			<style>
				#js {
					animation: appear 0.5s;
					opacity: 1;
				}
				#loading {
					display: none !important;
				}
			</style>
		`)

		context.html = $.html()
		return context
	},
}

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader(MiniCssExtractPlugin.loader)],
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

		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		}),
		process.env.ANALYZE_BUNDLE !== '1' &&
			new PrerenderSPAPlugin({
				...prerenderConfig,
				outputDir: path.resolve('dist', 'prerender', 'infrance'),
				routes: ['/', '/calculators/salary', '/iframes/simulateur-embauche'],
				indexPath: path.resolve('dist', 'infrance.html'),
			}),
		process.env.ANALYZE_BUNDLE !== '1' &&
			new PrerenderSPAPlugin({
				...prerenderConfig,
				outputDir: path.resolve('dist', 'prerender', 'mon-entreprise'),
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
				indexPath: path.resolve('dist', 'mon-entreprise.html'),
			}),
	].filter(Boolean),
}
