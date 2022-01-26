const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const config = require('./webpack.dev.js')
const compiler = webpack(config)
const history = require('connect-history-api-fallback')

const { watchDottedNames } = require('../modele-social/build')
watchDottedNames()

const rewrite = (basename) => ({
	from: new RegExp(`^/${basename}/(.*)$|^/${basename}$`),
	to: `/${basename}.html`,
})

app.get('/', function (req, res) {
	res.send(`<ul style="font-size: 200%;"><li><a href="/mon-entreprise">mon-entreprise [fr]</a></li>
	<li><a href="/infrance">mycompanyinfrance [en]</a></li>
	<li><a href="/mon-entreprise/dev/integration-test">intégration du simulateur sur site tiers [iframe fr]</a></li>
	</ul>`)
})

app.use(
	createProxyMiddleware('/polyfill.io', {
		target: 'https://polyfill.io',
		changeOrigin: true,
		pathRewrite: { '^/polyfill.io': '' },
	})
)

app.use(
	history({
		rewrites: ['infrance', 'mon-entreprise', 'publicodes'].map(rewrite),
	})
)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath,
		hot: true,
		stats: {
			//'minimal',
			all: false,
			modules: true,
			maxModules: 1,
			errors: true,
			warnings: true,
			logging: 'warn',
			moduleTrace: true,
			errorDetails: true,
			builtAt: true,
			entrypoints: true,
			colors: true,
		},
	})
)

app.use(require('webpack-hot-middleware')(compiler))

app.listen(8080, function () {
	// eslint-disable-next-line no-console
	console.log('Mon-entreprise listening on port 8080!\n')
})
