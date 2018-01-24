var webpack = require('webpack'),
	path = require('path')

module.exports = {
	devtool: 'cheap-module-source-map',
	resolve: {
		alias: {
			Engine: path.resolve('source/engine/'),
			Règles: path.resolve('source/règles/'),
			Components: path.resolve('source/components/')
		}
	},
	module: {
		loaders: [
			{
				// slow : ~ 1s
				test: /\.css$/,
				loader: 'ignore-loader'
			},
			{
				test: /\.html$/,
				loader: 'ignore-loader'
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
				//slow : ~ 3 seconds
				test: /\.(jpe?g|png|gif|svg)$/i,
				loader: 'ignore-loader'
			},
			{
				test: /\.ne$/,
				loader: 'babel-loader!nearley-loader'
			}
		]
	}
}
