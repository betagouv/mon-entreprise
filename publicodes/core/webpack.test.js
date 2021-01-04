import { commonLoaders } from '../../webpack/common'
import { EnvironmentPlugin } from 'webpack'

export const resolve = {
	extensions: ['.ts', '.tsx', '.js'],
}
export const output = {
	devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
	devtoolModuleFilenameTemplate: '[absolute-resource-path]',
}
export const mode = 'development'
export const module = {
	rules: [
		...commonLoaders(),
		{
			test: /\.css$/,
			use: ['css-loader', 'postcss-loader'],
		},
	],
}
export const plugins = [
	new EnvironmentPlugin({
		NODE_ENV: 'test',
	}),
]
