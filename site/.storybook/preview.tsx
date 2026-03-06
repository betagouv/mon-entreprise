import { Preview } from '@storybook/react'

import { DesignSystemThemeProvider } from '../source/design-system/root'
import { theme } from '../source/design-system/theme'
import { MockNavigationProvider } from '../source/lib/navigation'

const preview: Preview = {
	decorators: [
		(Story, context) => (
			<MockNavigationProvider>
				<DesignSystemThemeProvider
					forceDarkMode={
						context?.globals?.backgrounds?.value ===
						theme?.colors?.extended?.dark[800]
					}
				>
					<Story />
				</DesignSystemThemeProvider>
			</MockNavigationProvider>
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
