'use client'

import { ReactNode, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

import { DarkModeProvider } from '@/components/utils/DarkModeContext'
import {
	DesignSystemThemeProvider,
	StyledComponentsRegistry,
} from '@/design-system'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'
import { NextJsNavigationProvider } from '@/lib/navigation/providers/NextJsNavigationProvider'
import { createI18nClient } from '@/locales/i18n-client'
import { AvailableLang } from '@/locales/i18nResources'

export function ClientProviders({
	children,
	darkModeParDéfaut,
	langueParDéfaut,
}: {
	children: ReactNode
	darkModeParDéfaut: boolean
	langueParDéfaut: AvailableLang
}) {
	const [i18n] = useState(() => createI18nClient(langueParDéfaut))

	return (
		<StyledComponentsRegistry>
			<NextJsNavigationProvider>
				<I18nextProvider i18n={i18n}>
					<EmbeddedContextProvider>
						<DarkModeProvider darkModeParDéfaut={darkModeParDéfaut}>
							<DesignSystemThemeProvider>{children}</DesignSystemThemeProvider>
						</DarkModeProvider>
					</EmbeddedContextProvider>
				</I18nextProvider>
			</NextJsNavigationProvider>
		</StyledComponentsRegistry>
	)
}
