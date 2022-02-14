const { loadConfigFromFile, mergeConfig } = require('vite')
const reactPlugin = require('@vitejs/plugin-react')
const path = require('path')

module.exports = {
	stories: [
		'../source/**/*.stories.mdx',
		'../source/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
	framework: '@storybook/react',
	core: {
		builder: 'storybook-builder-vite',
	},
	features: {
		// Auto title not supported when not using storyStoreV7
		// See https://github.com/eirslett/storybook-builder-vite/issues/201
		storyStoreV7: true,
	},
	async viteFinal(config, { configType }) {
		const { config: userConfig } = await loadConfigFromFile(
			path.resolve(__dirname, '../vite.config.ts')
		)

		// Keep storybook plugins in storybookPlugins
		const storybookPlugins = config.plugins
		config.plugins = []

		const conf = mergeConfig(config, {
			...userConfig,
			plugins: [
				// Replace @vitejs/plugin-react from storybook by ours
				...storybookPlugins.filter(
					(plugin) =>
						!(Array.isArray(plugin) && plugin[0].name === 'vite:react-babel')
				),
				...userConfig.plugins,
			],
		})

		return conf
	},
}
