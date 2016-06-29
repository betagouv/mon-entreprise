var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
	historyApiFallback: true,
	stats: {
		colors: true
	},
	noInfo: false
}).listen(3000, 'localhost', function (err) {
	if (err)
		console.log(err)
	console.log('Bonjour ! Je vous sers sur localhost:3000')
})
