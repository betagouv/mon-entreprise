import React from 'react'
import DesignSystemThemeProvider from 'DesignSystem/root'
import { GlobalStyle } from 'DesignSystem/index'

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
