const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.dev.js')
const compiler = webpack(config)
const history = require('connect-history-api-fallback')

app.use(
	history({
		rewrites: [
			{
				from: /^\/embauche\/.*$|^\/embauche$/,
				to: '/embauche.html'
			},
			{
				from: /^\/infrance\/.*$|^\/infrance$/,
				to: '/infrance.html'
			},
			{
				from: /^\/publicodes\/.*$|^\/publicodes/,
				to: '/publicodes.html'
			}
		]
	})
)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath,
		hot: true
	})
)

app.use(require('webpack-hot-middleware')(compiler))

app.listen(8080, function() {
	console.log('Example app listening on port 8080!\n')
})
