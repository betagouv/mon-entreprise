const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common.js')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Server-side prerendering is not activated here. If you want to work on this, go see this fork's parent, github.com/betagouv/mon-entreprise

// If on master, with a URL_PATH env (used by the yarn build commmand)
// inject a base path, since the website is used from ecolab.ademe.fr/apps/transport/
//
// Only for the master branch, to enable netlify branch reviews to work
const prodPath = process.env.BRANCH === 'master' && process.env.URL_PATH

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader(MiniCssExtractPlugin.loader)],
	},
	mode: 'production',
	devtool: 'source-map',
	output: {
		...common.output,
		...(prodPath && { publicPath: prodPath }),
	},
	plugins: [
		...(common.plugins || []),
		...HTMLPlugins({ prodPath }),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			URL_PATH: prodPath,
		}),
	],
}
