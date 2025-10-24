import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: [
		'../source/**/*.stories.mdx',
		'../source/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	async viteFinal(config) {
		// Add proxy for twemoji images
		if (config.server) {
			config.server.proxy = {
				...config.server.proxy,
				'/twemoji': {
					target: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
					changeOrigin: true,
					rewrite: (path: string) => path.replace(/^\/twemoji/, ''),
					timeout: 3 * 1000,
				},
			}
		}

		return config
	},

	typescript: {
		reactDocgenTypescriptOptions: {
			propFilter: (prop) => {
				// Remove from controls aria-xxx props and props from react types
				return (
					!/aria-/.test(prop.name) &&
					!(
						prop.parent?.fileName &&
						/node_modules\/@types\/react/.test(prop.parent.fileName)
					)
				)
			},
		},
	},
}

export default config
