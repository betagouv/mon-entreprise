import React from 'react'

import { GlobalStyle } from '@/design-system/index'
import DesignSystemThemeProvider from '@/design-system/root'

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
