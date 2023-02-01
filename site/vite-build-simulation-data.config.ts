import { unlinkSync, writeFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	resolve: {
		alias: [{ find: '@', replacement: path.resolve('./source') }],
	},
	build: {
		outDir: './',
		target: 'esnext',
		emptyOutDir: false,
		lib: {
			entry: './scripts/search/export-simulation-data.ts',
			formats: ['es'],
			fileName: 'builded-simulation-data',
		},
	},
	plugins: [
		{
			name: 'remove-component-from-config',
			enforce: 'pre',
			transform(code, id) {
				// Remove Component from config
				return /Simulateurs\/.+\/_config\.ts$/.test(id)
					? code.replace(/component: [^,]+,/, '')
					: code
			},
		},
		{
			name: 'postbuild-commands',
			closeBundle: async () => {
				const path = './builded-simulation-data.js'
				type algoliaUpdateType = () => Record<string, unknown>
				const algoliaUpdate = (await import(path)) as algoliaUpdateType

				unlinkSync(path)
				writeFileSync(
					'./dist/simulation-data.json',
					JSON.stringify(algoliaUpdate)
				)
				console.log('done!')
			},
		},
	],
})
