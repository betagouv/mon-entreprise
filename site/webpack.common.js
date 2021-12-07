/* eslint-env node */
require('dotenv').config()
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const { EnvironmentPlugin } = require('webpack')

module.exports.styleLoader = (styleLoader) => ({
	test: /\.css$/,
	use: [
		{ loader: styleLoader },
		{
			loader: 'css-loader',
			options: {
				sourceMap: true,
				importLoaders: 1,
			},
		},
		{
			loader: 'postcss-loader',
		},
	],
})

module.exports.commonLoaders = ({ legacy = false } = {}) => {
	const babelLoader = {
		loader: 'babel-loader',
		options: {
			cacheDirectory: true,
			rootMode: 'upward',
			presets: [
				[
					'@babel/preset-env',
					{
						targets: !legacy
							? {
									esmodules: true,
							  }
							: {
									esmodules: false,
									browsers: ['ie 11'],
							  },
						useBuiltIns: 'entry',
						corejs: '3',
					},
				],
			],
		},
	}

	return [
		{
			test: /\.worker\.(js|ts|tsx)$/,
			use: [babelLoader, 'worker-loader'],
			exclude: /node_modules|dist/,
		},
		{
			test: /\.(js|ts|tsx)$/,
			use: babelLoader,
			exclude: /node_modules|dist/,
		},
		{
			test: /\.(jpe?g|png|svg)$/,
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 8192,
						name: 'images/[name].[ext]',
					},
				},
			],
		},
		{
			test: /\.(ttf|woff2?)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts',
						publicPath: '/fonts',
					},
				},
			],
		},
		{
			test: /\.yaml$/,
			use: ['json-loader', 'yaml-loader'],
		},
		{
			test: /\.toml$/,
			use: ['toml-loader'],
		},
		{
			test: /\.md$/,
			use: ['raw-loader'],
		},
		{
			test: /\.pdf$/,
			use: ['file-loader'],
		},
	]
}

module.exports.default = {
	resolve: {
		alias: {
			Actions: path.resolve('source/actions/'),
			Components: path.resolve('source/components/'),
			Selectors: path.resolve('source/selectors/'),
			Reducers: path.resolve('source/reducers/'),
			Types: path.resolve('source/types/'),
			Images: path.resolve('source/static/images/'),
			DesignSystem: path.resolve('source/design-system'),
			Data: path.resolve('source/data'),
			Hooks: path.resolve('source/hooks'),
			API: path.resolve('source/api'),
		},
		extensions: ['.js', '.ts', '.tsx'],
	},
	entry: {
		'mon-entreprise': './source/entry.fr.tsx',
		infrance: './source/entry.en.tsx',
		'simulateur-iframe-integration': './source/iframe-integration-script.js',
	},
	output: {
		globalObject: 'self',
	},
	plugins: [
		new EnvironmentPlugin({
			EN_BASE_URL: 'http://localhost:8080/infrance',
			FR_BASE_URL: 'http://localhost:8080/mon-entreprise',
			AT_INTERNET_SITE_ID: '',
		}),
		new EnvironmentPlugin({
			ALGOLIA_APP_ID: '',
			ALGOLIA_SEARCH_KEY: '',
			ALGOLIA_INDEX_PREFIX: '',
		}),
		new EnvironmentPlugin({
			GITHUB_REF: '',
			GITHUB_HEAD_REF: '',
			GITHUB_SHA: '',
		}),
		new CopyPlugin([
			'./source/static',
			{
				from: './source/data',
				to: 'data',
			},
			'./sw.js',
		]),
	],
}

module.exports.HTMLPlugins = ({ injectTrackingScript = false } = {}) => [
	new HTMLPlugin({
		template: 'index.html',
		inject: false,
		injectTrackingScript,
		// mycompanyinfrance.fr :
		chunks: ['infrance'],
		title:
			'My company in France: A step-by-step guide to start a business in France',
		description:
			'Find the type of company that suits you and follow the steps to register your company. Discover the French social security system by simulating your hiring costs. Discover the procedures to hire in France and learn the basics of French labour law.',
		filename: 'infrance.html',
		shareImage:
			'https://mon-entreprise.urssaf.fr/images/logo-mycompany-share.png',
		logo: 'images/logo-mycompany.svg',
	}),
	new HTMLPlugin({
		template: 'index.html',
		inject: false,
		injectTrackingScript,
		// mon-entreprise.urssaf.fr :
		chunks: ['mon-entreprise'],
		title:
			"mon-entreprise.urssaf.fr : L'assistant officiel du créateur d'entreprise",
		description:
			'Du statut juridique à la première embauche, en passant par la simulation des cotisations, vous trouverez ici toutes les ressources pour démarrer votre activité.',
		filename: 'mon-entreprise.html',
		shareImage: 'https://mon-entreprise.urssaf.fr/images/logo-share.png',
		logo: 'images/logo-monentreprise.svg',
	}),
]
