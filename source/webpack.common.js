/* eslint-env node */
const HTMLPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { EnvironmentPlugin } = require('webpack')
const path = require('path')

module.exports = {
	resolve: {
		alias: {
			Engine: path.resolve('source/engine/'),
			Règles: path.resolve('source/règles/'),
			Actions: path.resolve('source/actions/'),
			Ui: path.resolve('source/components/ui/'),
			Components: path.resolve('source/components/'),
			Selectors: path.resolve('source/selectors/'),
			Reducers: path.resolve('source/reducers/'),
			Types: path.resolve('source/types/'),
			Images: path.resolve('source/images/')
		}
	},
	entry: {
		publicodes: './source/sites/publicodes/entry.js'
	},
	output: {
		path: path.resolve('./dist/')
	},
	plugins: [
		new HTMLPlugin({
			template: 'index.html',
			chunks: ['publicodes'],
			title: 'Futureco ✍️',
			description: "L'impact sur le climat de vos gestes quotidiens",
			filename: 'publicodes.html'
		})
	]
}
