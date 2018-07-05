const common = require('./webpack.common.js')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
	...common,
	mode: 'production',
	entry: {
		bundle: ['@babel/polyfill', 'whatwg-fetch', './source/entry.js'],
		// le nom "simulateur" est là pour des raisons historiques
		//
		simulateur: './source/iframe-script.js',
		'colour-chooser': ['@babel/polyfill', './source/entry-colour-chooser.js']
	},
	plugins: [		
		new HTMLPlugin({
			template: 'entry-colour-chooser.html',
			chunks: ['colour-chooser']
		}),
		...common.plugins,
	]
}
