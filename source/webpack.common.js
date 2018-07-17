/* eslint-env node */
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
	resolve: {
		alias: {
			Engine: path.resolve('source/engine/'),
			Règles: path.resolve('source/règles/'),
			Actions: path.resolve('source/actions/'),
			Ui: path.resolve('source/components/ui/'),
			Components: path.resolve('source/components/'),
			Selectors: path.resolve('source/selectors/'),
			Reducers: path.resolve('source/reducers/'),
			Types: path.resolve('source/types/')
		}
	},
	entry: {
		infrance: ['./source/sites/mycompanyinfrance.fr/entry.js'],
		embauche: ['./source/sites/embauche.gouv.fr/entry.js'],
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
			chunks: ['infrance'],
			filename: 'infrance.html'
		}),
		new HTMLPlugin({
			template: 'index.html',
			chunks: ['embauche'],
			filename: 'embauche.html',
		}),
		new HTMLPlugin({
			template: 'couleur.html',
			chunks: ['colour-chooser'],
			filename: 'couleur.html'
		}),
		new CopyPlugin(['./manifest.webmanifest', './source/sites/embauche.gouv.fr/images/logo'])
	]
}
