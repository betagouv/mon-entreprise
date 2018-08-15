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
			Types: path.resolve('source/types/'),
			Images: path.resolve('source/images/')
		}
	},
	entry: {
		infrance: ['./source/sites/mycompanyinfrance.fr/entry.js'],
		embauche: ['./source/sites/embauche.gouv.fr/entry.js'],
		// To not introduce breaking into the iframe integration, we serve simulateur.js from a 'dist' subdirectory
		'dist/simulateur': ['./source/sites/embauche.gouv.fr/iframe-script.js'],
		engine: ['./source/engine/index.js']
	},
	output: {
		path: path.resolve('./dist/'),
		filename: ({ chunk }) =>
			['dist/simulateur', 'engine'].includes(chunk.name)
				? '[name].js'
				: '[name].[hash].js',
		libraryTarget: 'umd',
		library: 'Syso'
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
			title: 'My company in France 🇫🇷',
			description:
				'The easy and official guide to help you start your business in France. From registering your company to hiring your first employee.',
			filename: 'infrance.html'
		}),
		new HTMLPlugin({
			template: 'index.html',
			chunks: ['embauche'],
			title: "Simulateur d'embauche 🤝",
			description:
				"Simulation du prix d'une embauche en France et calcul du salaire net à partir du brut : CDD, statut cadre, cotisations sociales, retraite...",
			filename: 'embauche.html'
		}),
		new CopyPlugin([
			'./manifest.webmanifest',
			'./source/sites/embauche.gouv.fr/images/logo',
			'./robots.txt'
		])
	]
}
