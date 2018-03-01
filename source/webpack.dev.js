var webpack = require('webpack'),
	path = require('path'),
	HardSourceWebpackPlugin = require('hard-source-webpack-plugin'),
	common = require('./webpack.common.js')

module.exports = {
	...common,
	entry: {
		bundle: [
			'webpack-dev-server/client?http://0.0.0.0:3000/',
			'webpack/hot/only-dev-server',
			'@babel/polyfill',
			'react-hot-loader/patch',
			'./source/entry.js'
		]
		// entrées désactivées pour accélérer la compilation au dev
		//
		// le nom "simulateur" est là pour des raisons historiques
		//
		// simulateur: './source/iframe-script.js',
		// 'colour-chooser': ['@babel/polyfill', './source/entry-colour-chooser.js']
	},
	plugins: [
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new webpack.HotModuleReplacementPlugin(),
		new HardSourceWebpackPlugin()
	]
}
