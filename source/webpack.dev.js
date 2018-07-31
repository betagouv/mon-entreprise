const { map, concat } = require('ramda')
const webpack = require('webpack')
const common = require('./webpack.common.js')
const webpackServeWaitpage = require('webpack-serve-waitpage')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')

module.exports = {
	...common,
	mode: 'development',
	entry: map(concat(['react-hot-loader/patch']), common.entry),
	serve: {
		host: '0.0.0.0',
		add: (app, middleware, options) => {
			app.use(
				convert(
					history({
						rewrites: [
							{
								from: /^\/infrance\/.*$|^\/infrance$/,
								to: '/infrance.html'
							},
							{
								from: /^\/embauche\/.*$|^\/embauche$/,
								to: '/embauche.html'
							}
						]
					})
				)
			)

			app.use(
				webpackServeWaitpage(options, {
					theme: 'material'
				})
			)
		}
	},
	plugins: [
		...common.plugins,
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })
	]
}
