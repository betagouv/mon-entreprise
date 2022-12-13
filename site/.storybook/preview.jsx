import React from 'react'

import { DarkModeProvider } from '@/contexts/DarkModeContext'
import { GlobalStyle } from '@/design-system/index'
import DesignSystemThemeProvider from '@/design-system/root'

export const decorators = [
	(Story) => (
		<DesignSystemThemeProvider>
			<DarkModeProvider value={false}>
			<GlobalStyle />
			<Story />
			</DarkModeProvider>
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
