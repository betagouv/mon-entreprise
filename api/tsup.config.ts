import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: {
			index: 'serverless.ts',
		},
		format: ['cjs'],
		target: 'es2020',
		clean: true,
		dts: true,
		onSuccess: 'yarn postbuild',
	},
])
