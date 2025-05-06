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
