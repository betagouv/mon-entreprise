import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: './source/iframe-integration-script.js',
			name: 'monEntrepriseIframe',
			formats: ['iife'],
			fileName: () => 'simulateur-iframe-integration.js',
		},
		emptyOutDir: false,
	},
})
