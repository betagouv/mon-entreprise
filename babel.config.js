module.exports = api => {
	// This caches the Babel config by environment.
	api.cache.using(() => process.env.NODE_ENV)
	return {
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
			!api.env('production') && 'react-refresh/babel',
			['webpack-alias', { config: './source/webpack.dev.js' }],
			[
				'ramda',
				{
					useES: true
				}
			],
			'babel-plugin-styled-components'
		].filter(Boolean)
	}
}
