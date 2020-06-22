const {
	commonLoaders,
	styleLoader,
	HTMLPlugins,
	default: common,
} = require('./webpack.common.js')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Server-side prerendering is not activated here. If you want to work on this, go see this fork's parent, github.com/betagouv/mon-entreprise

module.exports = {
	...common,
	module: {
		rules: [...commonLoaders(), styleLoader(MiniCssExtractPlugin.loader)],
	},
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		...(common.plugins || []),
		...HTMLPlugins({ injectTrackingScript: true }),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		}),
	],
}
