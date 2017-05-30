var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
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
}).listen(3000, '0.0.0.0', function (err) {
	if (err)
		console.log(err) //eslint-disable-line no-console
	console.log('Bonjour ! Je vous sers sur localhost:3000') //eslint-disable-line no-console
})
