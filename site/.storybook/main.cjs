// TODO: Move to ESModule
const { loadConfigFromFile, mergeConfig } = require('vite')
const reactPlugin = require('@vitejs/plugin-react')
const path = require('path')
const VitePWA = require('vite-plugin-pwa').VitePWA
const yaml = require('@rollup/plugin-yaml')

module.exports = {
	stories: [
		'../source/**/*.stories.mdx',
		'../source/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
	framework: '@storybook/react',
	core: {
		builder: '@storybook/builder-vite',
	},
	features: {
		// Auto title not supported when not using storyStoreV7
		// See https://github.com/eirslett/storybook-builder-vite/issues/201
		storyStoreV7: true,
	},
	typescript: (config) => ({
		...config,
		reactDocgenTypescriptOptions: {
			...config.reactDocgenTypescriptOptions,
			propFilter: (prop) => {
				// Remove from controls aria-xxx props and props from react types
				return (
					!/aria-/.test(prop.name) &&
					!/node_modules\/@types\/react/.test(prop.parent?.fileName)
				)
			},
		},
	}),

	async viteFinal(config, { configType }) {
		const { config: userConfig } = await loadConfigFromFile(
			path.resolve(__dirname, '../vite.config.ts')
		) // Keep storybook plugins in storybookPlugins

		const storybookPlugins = config.plugins
		config.plugins = []
		const conf = mergeConfig(config, {
			...userConfig,
			base: configType === 'PRODUCTION' ? '/dev/storybook/' : userConfig.base,
			plugins: [
				// Replace @vitejs/plugin-react from storybook by ours
				...storybookPlugins.filter(
					(plugin) =>
						!(Array.isArray(plugin) && plugin[0].name === 'vite:react-babel')
				),
				reactPlugin({
					babel: {
						plugins: ['babel-plugin-styled-components'],
					},
					// Copied from https://github.com/eirslett/storybook-builder-vite/blob/917d8868943ec5f58c9c2c6900e196637f0d05e3/packages/storybook-builder-vite/vite-config.ts#L95
					// Do not treat story files as HMR boundaries, storybook itself needs to handle them.
					exclude: [/\.stories\.([tj])sx?$/, /node_modules/],
				}),
				yaml(),
				VitePWA({ disable: true }),
			],
		})

		return conf
	},

	managerHead: (head, { configType }) => {
		if (configType === 'PRODUCTION') {
			return `
				${head}
				<base href="/dev/storybook/">
      `
		}
	},
}
