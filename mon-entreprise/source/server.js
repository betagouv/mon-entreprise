import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import config from '../webpack.dev.js'
import history from 'connect-history-api-fallback'
import { watchDottedNames } from '../../modele-social/build.js'
import webpackhotMiddleware from 'webpack-hot-middleware'

const app = express()
const compiler = webpack(config)
watchDottedNames()

const rewrite = (basename) => ({
	from: new RegExp(`^/${basename}/(.*)$|^/${basename}$`),
	to: `/${basename}.html`,
})

app.get('/', function (req, res) {
	res.send(`<ul><li><a href="/mon-entreprise">mon-entreprise [fr]</a></li>
	<li><a href="/infrance">infrance [en]</a></li>
	<li><a href="/mon-entreprise/dev/integration-test">intégration du simulateur sur site tiers [iframe fr]</a></li>
	<li><a href="/publicodes">publicodes</a></li></ul>`)
})

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
	})
)

app.use(webpackhotMiddleware(compiler))

app.listen(8080, function () {
	// eslint-disable-next-line no-console
	console.log('Mon-entreprise listening on port 8080!\n')
})
