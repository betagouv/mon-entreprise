import { statSync } from 'fs'
import path from 'path'

import yaml from '@rollup/plugin-yaml'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	resolve: {
		alias: [{ find: '@', replacement: path.resolve('./source') }],
	},
	build: {
		lib: {
			entry: './source/entries/entry-iframe.ts',
			name: 'monEntrepriseIframe',
			formats: ['iife'],
			fileName: () => 'simulateur-iframe-integration.js',
		},
		emptyOutDir: false,
	},
	plugins: [
		yaml(),
		VitePWA({ disable: true }),
		{
			name: 'postbuild-commands',
			closeBundle: () => {
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				setTimeout(() => {
					const path = './dist/simulateur-iframe-integration.js'
					const stats = statSync(path)

					const limit = 5000
					if (stats.size > limit) {
						console.error(
							`Failed to build ${path}, the built file looks too big! (${stats.size} > ${limit})`
						)
					}
				}, 1000)
			},
		},
	],
})
