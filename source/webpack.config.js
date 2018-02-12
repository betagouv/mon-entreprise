var webpack = require('webpack'),
	path = require('path'),
	prodEnv = process.env.NODE_ENV == 'production' // eslint-disable-line no-undef

module.exports = {
	devtool: 'cheap-module-source-map',
	entry: {
		bundle: prodEnv
			? ['@babel/polyfill', 'whatwg-fetch', './source/entry.js']
			: [
					'webpack-dev-server/client?http://0.0.0.0:3000/',
					'webpack/hot/only-dev-server',
					'@babel/polyfill',
					'react-hot-loader/patch',
					'./source/entry.js'
				],
		// le nom "simulateur" est là pour des raisons historiques
		simulateur: './source/iframe-script.js',
		'colour-chooser': ['@babel/polyfill', './source/entry-colour-chooser.js']
	},
	output: {
		path: path.resolve('./dist/'),
		filename: '[name].js',
		publicPath: '/dist/'
	},
	resolve: {
		alias: {
			Engine: path.resolve('source/engine/'),
			Règles: path.resolve('source/règles/'),
			Components: path.resolve('source/components/'),
			Images: path.resolve('source/images/')
		}
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(jpe?g|png|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'images/[name].[ext]'
					}
				}
			},
			{
				test: /\.yaml$/,
				loader: 'json-loader!yaml-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.csv$/,
				loader: 'csv-loader',
				options: {
					dynamicTyping: true,
					header: true,
					skipEmptyLines: true
				}
			},
			{
				test: /\.ne$/,
				loader: 'babel-loader!nearley-loader'
			}
		]
	},
	plugins: [
		new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
		new webpack.NoEmitOnErrorsPlugin()
	]
		.concat(!prodEnv ? [new webpack.HotModuleReplacementPlugin()] : [])
		.concat(prodEnv ? [new webpack.optimize.UglifyJsPlugin()] : [])
}
