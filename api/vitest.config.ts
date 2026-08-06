import { defineConfig } from 'vitest/config'

export default defineConfig({
	esbuild: {
		target: 'ES2020',
	},
	test: {
		dir: 'source',
	},
})
