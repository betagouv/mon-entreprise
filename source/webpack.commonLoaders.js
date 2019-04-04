module.exports.styleLoader = styleLoader => ({
	test: /\.css$/,
	use: [
		{ loader: styleLoader },
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
})

module.exports.commonLoaders = ({ legacy = false } = {}) => {
	const babelLoader = {
		loader: 'babel-loader',
		options: {
			presets: [
				[
					'@babel/preset-env',
					{
						targets: !legacy
							? {
									esmodules: true
							  }
							: {
									esmodules: false,
									browsers: ['ie 11']
							  },
						useBuiltIns: 'entry'
					}
				]
			]
		}
	}

	return [
		{
			test: /\.worker\.js$/,
			use: { loader: 'workerize-loader' }
		},
		{ test: /\.js$/, loader: babelLoader, exclude: /node_modules|dist/ },
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
			use: ['json-loader', 'yaml-loader']
		},

		{
			test: /\.ne$/,
			use: [babelLoader, 'nearley-loader']
		}
	]
}
