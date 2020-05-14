const webpack = require('webpack')
const {
	default: common,
	commonLoaders
} = require('./mon-entreprise/webpack.common')

module.exports = {
	...common,
	module: {
		rules: [
			...commonLoaders(),
			{
				test: /\.css$/,
				use: ['css-loader', 'postcss-loader']
			}
		]
	},
	mode: 'development',
	plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })]
}
