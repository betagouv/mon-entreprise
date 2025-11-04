/// <reference types="vitest" />
/* eslint-disable no-console */

import path from 'path'

import mdx from '@mdx-js/rollup'
import replace from '@rollup/plugin-replace'
import yaml, { ValidYamlType } from '@rollup/plugin-yaml'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import { multipleSPA } from './build/multiple-SPA'
import { pwaOptions } from './build/vite-pwa-options'

const env = (mode: string) => loadEnv(mode, process.cwd(), '')

const branch = (mode: string) => getBranch(mode)

const sentryReleaseName = (mode: string) =>
	env(mode).VITE_GITHUB_SHA
		? `${branch(mode).split('/').at(-1)}-` +
		  env(mode).VITE_GITHUB_SHA?.substring(0, 7)
		: undefined

export default defineConfig(({ command, mode }) => ({
	resolve: {
		alias: [{ find: '@', replacement: path.resolve('./source') }],
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.mdx'],
	},
	publicDir: 'source/public',
	build: {
		minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
		sourcemap: true,
		rollupOptions: {
			output: {
				hoistTransitiveImports: false,
				manualChunks: (id) => {
					if (id.includes('modele-social')) {
						return 'modele-social'
					}
					if (id.includes('modele-as')) {
						return 'modele-as'
					}
					if (id.includes('modele-ti')) {
						return 'modele-ti'
					}
				},
				chunkFileNames: (chunkInfo) => {
					if (chunkInfo.isDynamicEntry) {
						return 'assets/lazy_[name].[hash].js'
					}

					return 'assets/[name].[hash].js'
				},
			},
		},
	},
	define: {
		BRANCH_NAME: JSON.stringify(branch(mode)),
		IS_DEVELOPMENT: mode === 'development',
		IS_STAGING: mode === 'production' && !isProductionBranch(mode),
		IS_PRODUCTION: mode === 'production' && isProductionBranch(mode),
		SENTRY_RELEASE_NAME: JSON.stringify(sentryReleaseName(mode)),
	},
	plugins: [
		command === 'build' &&
			replace({
				__SENTRY_DEBUG__: false,
				preventAssignment: false,
			}),

		mdx(),
		react(),

		yaml({
			transform(data, filePath) {
				return filePath.endsWith('/rules-en.yaml')
					? cleanAutomaticTag(data)
					: data
			},
		}),

		multipleSPA({
			defaultSite: 'mon-entreprise',
			templatePath: './source/entries/template.html',
			sites: {
				'mon-entreprise': {
					lang: 'fr',
					entry: '/source/entries/entry-fr.tsx',
					logo: '/source/assets/images/logo-monentreprise.svg',
					logoAlt: 'Mon-entreprise, site Urssaf',
				},
				infrance: {
					lang: 'en',
					entry: '/source/entries/entry-en.tsx',
					logo: '/logo-mycompany-share.png',
					logoAlt: 'My company in France by Urssaf',
				},
			},
		}),

		VitePWA(pwaOptions),

		legacy({
			targets: ['defaults', 'not IE 11'],
		}),

		splitVendorChunkPlugin(),

		sentryVitePlugin({
			org: 'betagouv',
			project: 'mon-entreprise',
			url: 'https://sentry.incubateur.net/',
			authToken: process.env.SENTRY_AUTH_TOKEN,
			telemetry: false,
			release: {
				// Use same release name as the one used in the app.
				name: sentryReleaseName(mode),
				inject: false, // Avoid adding imports with a hash in chunks, as this causes long term caching issues.
				uploadLegacySourcemaps: {
					paths: ['./dist'],
					ignore: ['./node_modules'],
				},
			},
		}),
	],

	server: {
		port: 3000,
		hmr: {
			clientPort:
				typeof env(mode).HMR_CLIENT_PORT !== 'undefined'
					? parseInt(env(mode).HMR_CLIENT_PORT)
					: undefined,
		},
		// Keep watching changes in the publicodes package to support live reload
		// when we iterate on publicodes logic.
		// https://vitejs.dev/config/#server-watch
		watch: {
			ignored: [
				'!**/node_modules/publicodes/**',
				'!**/node_modules/@publicodes\\/react-ui/**',
			],
		},
		proxy: {
			'/api': 'http://localhost:3004',
			'/twemoji': {
				target: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/twemoji/, ''),
				timeout: 3 * 1000,
			},
		},
	},

	optimizeDeps: {
		entries: ['./source/entries/entry-fr.tsx', './source/entries/entry-en.tsx'],
		include: ['@publicodes\\/react-ui > react/jsx-runtime'],
		exclude: ['@publicodes\\/react-ui', 'publicodes'],
	},

	ssr: {
		/**
		 * Prevent listed dependencies from being externalized for SSR build cause some
		 * packages are not esm ready or package.json setup seems wrong:
		 */
		noExternal: [/tslib/],
	},
	test: {
		environmentMatchGlobs: [
			// all tests in source with tsx will run in happy-dom (component tests)
			['source/**/*.test.tsx', 'happy-dom'],
		],
		setupFiles: ['./vitest-setup.ts'],
	},
}))

/**
 * We use this function to hide some features in production while keeping them
 * in feature-branches. In case we do A/B testing with several branches served
 * in production, we should add the public faced branch names in the test below.
 * This is different from the import.meta.env.MODE in that a feature branch may
 * be build in production mode (with the NODE_ENV) but we may still want to show
 * or hide some features.
 */
const isProductionBranch = (mode: string) => {
	return ['master', 'next'].includes(getBranch(mode))
}

const getBranch = (mode: string) => {
	let branch: string | undefined = env(mode)
		.VITE_GITHUB_REF?.split('/')
		?.slice(-1)?.[0]

	if (branch === 'merge') {
		branch = env(mode).VITE_GITHUB_HEAD_REF
	}

	return branch ?? ''
}

const cleanAutomaticTag = (data: ValidYamlType): ValidYamlType => {
	if (typeof data === 'string' && data.startsWith('[automatic] ')) {
		return data.replace('[automatic] ', '')
	}

	if (Array.isArray(data)) {
		return data.map((val) => cleanAutomaticTag(val))
	}

	if (data && typeof data === 'object') {
		return Object.fromEntries<ValidYamlType>(
			Object.entries(data).map(([key, val]) => [key, cleanAutomaticTag(val)])
		)
	}

	return data
}
