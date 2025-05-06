import { Preview } from '@storybook/react'
import React from 'react'

import DesignSystemThemeProvider from '../source/design-system/root'
import theme from '../source/design-system/theme'

const preview: Preview = {
	decorators: [
		(Story, context) => (
			<DesignSystemThemeProvider
				forceDarkMode={
					context?.globals?.backgrounds?.value ===
					theme?.colors?.extended?.dark[800]
				}
			>
				<Story />
			</DesignSystemThemeProvider>
		),
	],
	parameters: {
		backgrounds: {
			values: [
				{ name: 'light', value: '#ffffff' },
				{ name: 'dark', value: theme.colors.extended.dark[800] },
			],
		},
	},
}

export default preview
