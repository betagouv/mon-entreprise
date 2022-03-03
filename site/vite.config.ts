import yaml from '@rollup/plugin-yaml'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import fs from 'fs/promises'
import path from 'path'
import toml from 'rollup-plugin-toml'
import { defineConfig, Plugin } from 'vite'
import shimReactPdf from 'vite-plugin-shim-react-pdf'
import serveStatic from 'serve-static'
import { Project } from 'ts-morph'

const buildYamlToDts = [
	'Simulateurs/EconomieCollaborative/activités.yaml',
	'Simulateurs/EconomieCollaborative/activités.en.yaml',
]

export default defineConfig(({ command }) => ({
	resolve: {
		alias: { '@': path.resolve('./source') },
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
	},
	publicDir: 'source/public',
	plugins: [
		react({
			babel: { plugins: ['babel-plugin-styled-components'] },
		}),
		yaml({
			/**
			 * Build yaml to d.ts when vite build
			 */
			transform: (data, filePath): undefined => {
				if (
					command === 'serve' ||
					!buildYamlToDts.some((p) => filePath.includes(p))
				) {
					return
				}

				const relativePath = filePath.replace(__dirname + '/', '')
				console.log('Transform:', relativePath)

				const source = JSON.stringify(data)
				const defaultExportedJson = `const _default = ${source} as const\nexport default _default`

				const project = new Project({
					compilerOptions: {
						declaration: true,
						emitDeclarationOnly: true,
					},
				})

				project.createSourceFile(filePath + '.ts', defaultExportedJson, {
					overwrite: true,
				})

				project
					.emit()
					.then(() => console.log('  Done!  :', relativePath + '.d.ts'))
					.catch((err) => console.error(err))

				return
			},
		}),
		toml,
		shimReactPdf(),
		multipleSPA({
			defaultSite: 'mon-entreprise',
			templatePath: './source/template.html',
			sites: {
				'mon-entreprise': {
					lang: 'fr',
					entry: '/source/entry.fr.tsx',
					title:
						"mon-entreprise.urssaf.fr : L'assistant officiel du créateur d'entreprise",
					description:
						'Du statut juridique à la première embauche, en passant par la simulation des cotisations, vous trouverez ici toutes les ressources pour démarrer votre activité.',
					shareImage: 'https://mon-entreprise.urssaf.fr/logo-share.png',
				},
				infrance: {
					lang: 'en',
					entry: '/source/entry.en.tsx',
					title:
						'My company in France: A step-by-step guide to start a business in France',
					description:
						'Find the type of company that suits you and follow the steps to register your company. Discover the French social security system by simulating your hiring costs. Discover the procedures to hire in France and learn the basics of French labour law.',
					shareImage:
						'https://mon-entreprise.urssaf.fr/logo-mycompany-share.png',
				},
			},
		}),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
}))

type MultipleSPAOptions = {
	defaultSite: string
	templatePath: string
	sites: Record<string, Record<string, string>>
}

/**
 * A custom plugin to create multiple virtual html files from a template. Will
 * generate distinct entry points and single-page application outputs.
 */
function multipleSPA(options: MultipleSPAOptions): Plugin {
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
			vite.middlewares.use(
				'/simulateur-iframe-integration.js',
				serveStatic(new URL('./dist', import.meta.url).pathname, {
					index: 'simulateur-iframe-integration.js',
				})
			)
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			vite.middlewares.use(async (req, res, next) => {
				const url = req.originalUrl
				if (url === '/') {
					res.writeHead(302, { Location: '/' + options.defaultSite })
					res.end()
				} else if (
					url &&
					Object.keys(options.sites).some((name) =>
						url.slice(1).startsWith(name)
					)
				) {
					const siteName = url.slice(1).split('/')[0]
					const content = await vite.transformIndexHtml(
						'/',
						await fillTemplate(siteName),
						url
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
