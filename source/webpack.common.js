/* eslint-env node */
const WorkboxPlugin = require('workbox-webpack-plugin')
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
	resolve: {
		alias: {
			Engine: path.resolve('source/engine/'),
			Règles: path.resolve('source/règles/'),
			Components: path.resolve('source/components/'),
			Images: path.resolve('source/images/'),
			Selectors: path.resolve('source/selectors/')
		}
	},
	output: {
		path: path.resolve('./dist/'),
		filename: '[name].[hash].js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(jpe?g|png|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'images/[name].[ext]'
					}
				}
			},
			{
				test: /\.yaml$/,
				loader: 'json-loader!yaml-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules|dist/,
				loader: 'babel-loader'
			},
			{
				test: /\.csv$/,
				loader: 'csv-loader',
				options: {
					dynamicTyping: true,
					header: true,
					skipEmptyLines: true
				}
			},
			{
				test: /\.ne$/,
				loader: 'babel-loader!nearley-loader'
			}
		]
	},
	plugins: [
		new HTMLPlugin({
			template: 'index.html',
			chunks: ['bundle']
		}),
		new HTMLPlugin({
			template: 'couleur.html',
			chunks: ['colour-chooser'],
			filename: 'couleur.html'
		}),
		new CopyPlugin(['./manifest.webmanifest', './source/images/logo']),
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
