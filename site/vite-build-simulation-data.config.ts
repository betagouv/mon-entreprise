import { unlinkSync, writeFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

import { PageConfig } from '@/pages/Simulateurs/configs/types'

import { objectTransform } from './source/utils'

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
				// Remove `component` and `seoExplanations` from config
				const isConfigFile = /Simulateurs\/.+\/_config\.tsx?$/.test(id)

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
					const path = './builded-simulation-data.js'
					type PageConfigType = {
						default: Record<string, Omit<PageConfig, 'component'>>
					}
					const algoliaUpdate = ((await import(path)) as PageConfigType).default

					unlinkSync(path)
					writeFileSync(
						'./source/public/simulation-data.json',
						JSON.stringify(filterOgImage(algoliaUpdate))
					)
					writeFileSync(
						'./source/public/simulation-data-title.json',
						JSON.stringify(
							Object.fromEntries(
								Object.entries(algoliaUpdate).map(([id, { title }]) => [
									id,
									{ title },
								])
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
