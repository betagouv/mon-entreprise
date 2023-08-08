import { writeFileSync } from 'fs'
import { join, resolve } from 'path'

import { defineConfig } from 'vite'

import type { PageConfig } from '@/pages/simulateurs/_configs/types'

import { objectTransform } from '../source/utils'

const filterOgImage = (obj: Record<string, Omit<PageConfig, 'component'>>) =>
	objectTransform(obj, (entries) => {
		return entries.map(([key, val]) => {
			if (
				'meta' in val &&
				val.meta != null &&
				typeof val.meta === 'object' &&
				'ogImage' in val.meta
			) {
				delete val.meta.ogImage
			}

			return [key, val]
		})
	})

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
			name: 'remove-component-from-config',
			enforce: 'pre',
			transform(code, id) {
				// Remove `component` and `seoExplanations` from config
				const isConfigFile = /pages\/.+\/config\.tsx?$/.test(id)

				if (isConfigFile) {
					// eslint-disable-next-line no-console
					console.log('transform:', id)
				}

				return isConfigFile
					? code.replace(/^\s+(component|seoExplanations):?[^,]*,/gm, '')
					: code
			},
		},
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
					type PageConfigType = {
						default: Record<string, Omit<PageConfig, 'component'>>
					}
					const algoliaUpdate = ((await import(path)) as PageConfigType).default

					writeFileSync(
						'./source/public/simulation-data.json',
						JSON.stringify(filterOgImage(algoliaUpdate))
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
