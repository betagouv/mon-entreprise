'use client'

import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import { DarkModeProvider } from '@/components/utils/DarkModeContext'
import {
	DesignSystemThemeProvider,
	StyledComponentsRegistry,
} from '@/design-system'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'
import { NextJsNavigationProvider } from '@/lib/navigation/providers/NextJsNavigationProvider'
import i18nextClient from '@/locales/i18n-client'

export function ClientProviders({
	children,
	initialDarkMode,
}: {
	children: ReactNode
	initialDarkMode: boolean
}) {
	return (
		<StyledComponentsRegistry>
			<NextJsNavigationProvider>
				<I18nextProvider i18n={i18nextClient}>
					<EmbeddedContextProvider>
						<DarkModeProvider initialDarkMode={initialDarkMode}>
							<DesignSystemThemeProvider>{children}</DesignSystemThemeProvider>
						</DarkModeProvider>
					</EmbeddedContextProvider>
				</I18nextProvider>
			</NextJsNavigationProvider>
		</StyledComponentsRegistry>
	)
}
