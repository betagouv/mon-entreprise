	const common = require('./webpack.common.js')

module.exports = {
	...common,
	mode: 'production',
	entry: {
		bundle: ['@babel/polyfill', 'whatwg-fetch', './source/entry.js'],
		// le nom "simulateur" est là pour des raisons historiques
		//
		simulateur: './source/iframe-script.js',
		'colour-chooser': ['@babel/polyfill', './source/entry-colour-chooser.js']
	}
}
