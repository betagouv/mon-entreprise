import fs from 'fs/promises'

import serveStatic from 'serve-static'
import { Plugin } from 'vite'

type MultipleSPAOptions = {
	defaultSite: string
	templatePath: string
	sites: Record<string, Record<string, string>>
}

/**
 * A custom plugin to create multiple virtual html files from a template. Will
 * generate distinct entry points and single-page application outputs.
 */
export function multipleSPA(options: MultipleSPAOptions): Plugin {
	const fillTemplate = async (siteName: string) => {
		const siteData = options.sites[siteName]
		const template = await fs.readFile(options.templatePath, 'utf-8')
		const filledTemplate = template
			.toString()
			.replace(/\{\{(.+)\}\}/g, (_match, p1) => siteData[(p1 as string).trim()])

		return filledTemplate
	}

	return {
		name: 'multiple-spa',
		enforce: 'pre',

		configureServer(vite) {
			// TODO: this middleware is specific to the "mon-entreprise" app and
			// shouldn't be in the "multipleSPA" plugin. It allows to serve the
			// iframe integration script (already built) from the same server as the app.
			vite.middlewares.use(
				'/simulateur-iframe-integration.js',
				serveStatic(new URL('./dist', import.meta.url).pathname, {
					index: 'simulateur-iframe-integration.js',
				})
			)

			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			vite.middlewares.use(async (req, res, next) => {
				const url = req.originalUrl?.replace(/^\/%2F/, '/')

				const firstLevelDir = url?.slice(1).split('/')[0]

				if (url && /\?.*html-proxy/.test(url)) {
					return next()
				}

				if (url && ['/', '/index.html'].includes(url)) {
					res.writeHead(302, { Location: '/' + options.defaultSite }).end()
				}
				// this condition is for the start:netlify script to match /mon-entreprise or /infrance
				else if (
					firstLevelDir &&
					url &&
					Object.keys(options.sites)
						.map((site) => `/${site}.html`)
						.includes(url)
				) {
					const siteName = firstLevelDir.replace('.html', '')
					const content = await vite.transformIndexHtml(
						'/' + siteName,
						await fillTemplate(siteName)
					)
					res.end(content)
				} else if (
					firstLevelDir &&
					Object.keys(options.sites).some((name) => firstLevelDir === name)
				) {
					const siteName = firstLevelDir
					const content = await vite.transformIndexHtml(
						url,
						await fillTemplate(siteName)
					)
					res.end(content)
				} else {
					next()
				}
			})
		},

		config(config, { command }) {
			if (command === 'build' && !config.build?.ssr) {
				config.build = {
					...config.build,
					rollupOptions: {
						...config.build?.rollupOptions,
						input: Object.fromEntries(
							Object.keys(options.sites).map((name) => [
								name,
								`virtual:${name}.html`,
							])
						),
					},
				}
			}
		},

		resolveId(id) {
			const pathname = id.split('/').slice(-1)[0]
			if (pathname?.startsWith('virtual:')) {
				return pathname.replace('virtual:', '')
			}

			return null
		},

		async load(id) {
			if (
				Object.keys(options.sites).some((name) => id.endsWith(name + '.html'))
			) {
				return await fillTemplate(id.replace(/\.html$/, ''))
			}
		},
	}
}
