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
		}
	},
	entry: {
		'mon-entreprise': './source/sites/mon-entreprise.fr/entry.fr.js',
		infrance: './source/sites/mon-entreprise.fr/entry.en.js',
		'simulateur-iframe-integration':
			'./source/sites/mon-entreprise.fr/iframe-integration-script.js',
		publicodes: './source/sites/publicodes/entry.js'
	},
	output: {
		path: path.resolve('./dist/')
	},
	plugins: [
		new EnvironmentPlugin({
			EN_SITE: '/infrance${path}',
			FR_SITE: '/mon-entreprise${path}',
			MASTER: false
		}),
		new HTMLPlugin({}),

		new CopyPlugin([
			'./manifest.webmanifest',
			{
				from: './source/sites/mon-entreprise.fr/robots.txt',
				to: 'robots.infrance.txt'
			},
			{
				from: './source/sites/mon-entreprise.fr/sitemap.fr.txt',
				to: 'sitemap.infrance.fr.txt'
			},
			{
				from: './source/sites/mon-entreprise.fr/sitemap.en.txt',
				to: 'sitemap.infrance.en.txt'
			},
			{
				from: './source/images',
				to: 'images'
			},
			{
				from: './source/sites/mon-entreprise.fr/favicon',
				to: 'favicon'
			}
		])
	]
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
		{ test: /\.js$/, loader: babelLoader, exclude: /node_modules|dist/ },
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
			test: /\.ne$/,
			use: [babelLoader, 'nearley-loader']
		}
	]
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
		shareImage: 'https://mon-entreprise.fr/images/logo-mycompany-share.png',
		logo: 'images/logo-mycompany.svg'
	}),
	new HTMLPlugin({
		template: 'index.html',
		inject: false,
		injectTrackingScript,
		// mon-entreprise.fr :
		chunks: ['mon-entreprise'],
		title: "Mon-entreprise.fr : L'assistant officiel du créateur d'entreprise",
		description:
			'Du statut juridique à la première embauche, en passant par la simulation des cotisations, vous trouverez ici toutes les ressources pour démarrer votre activité.',
		filename: 'mon-entreprise.html',
		shareImage: 'https://mon-entreprise.fr/images/logo-share.png',
		logo: 'images/logo.svg'
	}),
	new HTMLPlugin({
		inject: false,

		template: 'index.html',
		logo: 'https://futur.eco/images/logo.png',
		chunks: ['publicodes']

			title: 'Futureco ✍️',
			description: "L'impact sur le climat de vos gestes quotidiens",
			filename: 'publicodes.html'
	})
]
