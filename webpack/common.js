/* eslint-env node */

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

module.exports.commonLoaders = ({ legacy = false, file = true } = {}) => {
	const babelLoader = {
		loader: 'babel-loader',
		options: {
			cacheDirectory: true,
			rootMode: 'upward',
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
						useBuiltIns: 'entry',
						corejs: '3'
					}
				]
			]
		}
	}

	return [
		{
			test: /\.(js|ts|tsx)$/,
			use: babelLoader,
			exclude: /node_modules|dist/
		},
		...(file
			? [
					{
						test: /\.(jpe?g|png|svg)$/,
						use: [
							{
								loader: 'url-loader',
								options: {
									limit: 8192,
									name: 'images/[name].[ext]'
								}
							}
						]
					}
			  ]
			: []),
		{
			test: /\.(ttf|woff2?)$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts',
						publicPath: '/fonts'
					}
				}
			]
		},
		{
			test: /\.yaml$/,
			use: ['json-loader', 'yaml-loader']
		},
		{
			test: /\.toml$/,
			use: ['toml-loader']
		},
		{
			test: /\.ne$/,
			use: [babelLoader, 'nearley-loader']
		},
		{
			test: /\.md$/,
			use: ['raw-loader']
		},
		{
			test: /\.pdf$/,
			use: ['file-loader']
		}
	]
}
