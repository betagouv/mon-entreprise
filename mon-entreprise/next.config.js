const {
	HTMLPlugins,
	styleLoader,
	commonLoaders,
	default: common,
} = require('./webpack.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack: function (config, options) {
		config.module.rules = [
			...config.module.rules,
			styleLoader(
				options.isServer
					? {
							loader: MiniCssExtractPlugin.loader,
							options: {
								filename: 'static/style.css',
								emit: !options.dev,
							},
					  }
					: 'style-loader'
			),
			...commonLoaders(),
		]
		config.plugins = [
			...config.plugins,
			new MiniCssExtractPlugin({
				filename: 'static/style.css',
				emit: !options.dev,
			}),
		]
		// config.module.rules.push({
		// 	test: /\.ya?ml$/,
		// 	use: 'js-yaml-loader',
		// })
		return config
	},
}
