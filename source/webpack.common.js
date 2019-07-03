/* eslint-env node */
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const path = require('path')

const HTMLPluginCommonParams = {
	template: 'index.html',
	inject: false,
	production: process.env.NODE_ENV === 'production'
}

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
		'mon-entreprise': './source/sites/mon-entreprise.fr/entry.fr.js',
		infrance: './source/sites/mon-entreprise.fr/entry.en.js',
		'simulateur-iframe-integration':
			'./source/sites/mon-entreprise.fr/iframe-integration-script.js'
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
		new HTMLPlugin({
			...HTMLPluginCommonParams,
			chunks: ['infrance'],
			title:
				'My company in France: A step-by-step guide to start a business in France',
			description:
				'Find the type of company that suits you and follow the steps to register your company. Discover the French social security system by simulating your hiring costs. Discover the procedures to hire in France and learn the basics of French labour law.',
			filename: 'infrance.html',
			logo: 'https://mon-entreprise.fr/images/logo-mycompany.png'
		}),
		new HTMLPlugin({
			...HTMLPluginCommonParams,
			chunks: ['mon-entreprise'],
			title:
				"Mon-entreprise.fr : L'assistant officiel du créateur d'entreprise",
			description:
				'Du statut juridique à la première embauche, en passant par la simulation des cotisations, vous trouverez ici toutes les ressources pour démarrer votre activité.',
			filename: 'mon-entreprise.html',
			logo: 'https://mon-entreprise.fr/images/logo.png'
		}),

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
