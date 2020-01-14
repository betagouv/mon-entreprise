module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current'
				}
			}
		],
		'@babel/react',
		'@babel/preset-typescript'
	],
	plugins: [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-optional-chaining',
		'@babel/plugin-proposal-nullish-coalescing-operator',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-syntax-dynamic-import',
		'react-refresh/babel',
		['webpack-alias', { config: './source/webpack.dev.js' }],
		[
			'ramda',
			{
				useES: true
			}
		],
		'babel-plugin-styled-components'
	]
}
