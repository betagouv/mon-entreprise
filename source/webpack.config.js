var webpack = require('webpack'),
	autoprefixer = require('autoprefixer')

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: [
		'webpack-dev-server/client?http://localhost:3000/',
		'webpack/hot/only-dev-server',
		'react-hot-loader/patch',
		'babel-polyfill',
		'./source/entry.js'
	],
	output: {
		path: require('path').resolve('./dist/'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},
	module: {
		loaders: [ {
			test: /\.css$/,
			loader: 'style!css!postcss-loader'
		}, {
			test: /\.html$/,
			loader: 'html'
		},
		{
			test: /\.yaml$/,
			loader: 'json!yaml'
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},
		{
			test: /\.(jpe?g|png|gif|svg)$/i,
			loader: 'url?limit=10000!img?progressive=true'
		}]
	},
	postcss: [
		autoprefixer({
			browsers: [ '> 1% in FR', 'not ie < 10' ]
		})
	],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		// in order to use the fetch polyfill:
		new webpack.ProvidePlugin({
			'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
		})
	]
}
