import React from 'react'
import DesignSystemThemeProvider from '~/design-system/root'
import { GlobalStyle } from '~/design-system/index'

export const decorators = [
	(Story) => (
		<DesignSystemThemeProvider>
			<GlobalStyle />
			<Story />
		</DesignSystemThemeProvider>
	),
]

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
		expanded: true,
		sort: 'requiredFirst',
	},
}
