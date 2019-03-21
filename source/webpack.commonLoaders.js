module.exports = {
	web: [
		{
			test: /\.css$/,
			use: [
				{ loader: 'style-loader' },
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
		}
	],
	universal: [
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
			exclude: /node_modules|dist/,
			loader: 'babel-loader'
		},
		{
			test: /\.ne$/,
			loader: 'babel-loader!nearley-loader'
		}
	]
}
