import yaml from '@rollup/plugin-yaml'
import react from '@vitejs/plugin-react'
import path from 'path'
import toml from 'rollup-plugin-toml'
import { defineConfig } from 'vite'
import { injectHtml } from 'vite-plugin-html'
import { watchDottedNames } from '../modele-social/build.js'

if (process.env.WATCH_MODELE_SOCIAL) {
	watchDottedNames()
}

/**
 * @type {import('vite').Config}
 */
export default defineConfig({
	resolve: {
		alias: {
			Actions: path.resolve('source/actions/'),
			Components: path.resolve('source/components/'),
			Selectors: path.resolve('source/selectors/'),
			Reducers: path.resolve('source/reducers/'),
			Types: path.resolve('source/types/'),
			Images: path.resolve('source/static/images/'),
			DesignSystem: path.resolve('source/design-system'),
			Data: path.resolve('source/data'),
			Hooks: path.resolve('source/hooks'),
			API: path.resolve('source/api'),
		},
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
	},
	publicDir: 'source/static',
	plugins: [
		react({
			babel: {
				plugins: ['babel-plugin-styled-components'],
			},
		}),
		yaml(),
		toml,
		injectHtml(),
	],
	build: {},
})
