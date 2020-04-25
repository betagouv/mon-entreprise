/* eslint-env node */
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const path = require('path')

module.exports.default = {
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
		},
		extensions: ['.js', '.ts', '.tsx']
	},
	entry: {
		publicodes: './source/sites/publicodes/entry.js'
	},
	output: {
		path: path.resolve('./dist/'),
		globalObject: 'self'
	},
	plugins: [new CopyPlugin(['./manifest.webmanifest'])]
}

module.exports.styleLoader = styleLoader => ({
	test: /\.css$/,
	use: [
		{ loader: styleLoader },
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
})

module.exports.commonLoaders = ({ legacy = false } = {}) => {
	const babelLoader = {
		loader: 'babel-loader',
		options: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: !legacy
							? {
									esmodules: true
							  }
							: {
									esmodules: false,
									browsers: ['ie 11']
							  },
						useBuiltIns: 'entry',
						corejs: '3'
					}
				]
			]
		}
	}

	return [
		{
			test: /\.(js|ts|tsx)$/,
			loader: babelLoader,
			exclude: /node_modules|dist/
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
			use: ['json-loader', 'yaml-loader']
		},
		{
			test: /\.toml$/,
			use: ['toml-loader']
		},
		{
			test: /\.ne$/,
			use: [babelLoader, 'nearley-loader']
		},
		{
			test: /\.csv$/,
			loader: 'csv-loader',
			options: {
				dynamicTyping: true,
				header: true,
				skipEmptyLines: true
			}
		}
	]
}

module.exports.HTMLPlugins = ({ injectTrackingScript = false } = {}) => [
	new HTMLPlugin({
		inject: false,

		template: 'index.html',
		logo: 'https://futur.eco/images/logo.svg',
		chunks: ['publicodes'],

		title: "Futureco 🔥 – L'impact climat de vos gestes quotidiens",
		description:
			"La catastrophe climatique n'est plus qu'une menace lointaine, c'est une actualité. Tous vos gestes et consommations quotidiennes impactent le climat. À vous de jouer !",
		filename: 'publicodes.html'
	})
]
