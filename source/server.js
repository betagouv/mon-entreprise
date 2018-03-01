var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.dev')

const PORT = process.env.PORT || 3000

new WebpackDevServer(webpack(config), {
	disableHostCheck: true,
	publicPath: config.output.publicPath,
	hot: true,
	headers: { 'Access-Control-Allow-Origin': '*' }, //for hot reloading
	historyApiFallback: true,
	// It suppress error shown in console, so it has to be set to false.
	quiet: false,
	// It suppress everything except error, so it has to be set to false as well
	// to see success build.
	noInfo: false,
	stats: {
		// Config for minimal console.log mess.
		assets: false,
		colors: true,
		version: false,
		hash: false,
		timings: false,
		chunks: false,
		chunkModules: false
	}
}).listen(PORT, '0.0.0.0', function(err) {
	if (err) console.log(err) //eslint-disable-line no-console
	console.log('Bonjour ! Je vous sers sur localhost:' + PORT) //eslint-disable-line no-console
})
