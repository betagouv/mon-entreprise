import yaml from '@rollup/plugin-yaml'
import path from 'path'
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
	plugins: [yaml(), VitePWA({ disable: true })],
})
