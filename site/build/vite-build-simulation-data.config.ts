import { writeFileSync } from 'fs'
import { join, resolve } from 'path'

import { defineConfig } from 'vite'

import { PageMetadata } from '@/pages/simulateurs/_configs/types'

export default defineConfig({
	resolve: {
		alias: [{ find: '@', replacement: resolve('./source') }],
	},
	build: {
		outDir: './dist',
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
			name: 'postbuild-commands',
			closeBundle: () => {
				// eslint-disable-next-line @typescript-eslint/no-misused-promises
				setTimeout(async () => {
					const path = join(
						import.meta.url,
						'../../dist/builded-simulation-data.js'
					)
					console.log('path', path)
					type MetadataExport = {
						default: Record<string, PageMetadata>
					}
					const algoliaUpdate = ((await import(path)) as MetadataExport).default

					writeFileSync(
						'./source/public/simulation-data.json',
						JSON.stringify(algoliaUpdate)
					)
					writeFileSync(
						'./source/public/simulation-data-title.json',
						JSON.stringify(
							Object.fromEntries(
								Object.entries(algoliaUpdate).map(
									([, { iframePath, title }]) => [iframePath, { title }]
								)
							)
						)
					)
					// eslint-disable-next-line no-console
					console.log('done!')
				}, 1000)
			},
		},
	],
})
