'use client'

import { ReactNode, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'

import { DarkModeProvider } from '@/components/utils/DarkModeContext'
import {
	DesignSystemThemeProvider,
	StyledComponentsRegistry,
} from '@/design-system'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'
import { NextJsNavigationProvider } from '@/lib/navigation/providers/NextJsNavigationProvider'
import { createI18nClient } from '@/locales/i18n-client'
import { AvailableLang } from '@/locales/i18nResources'
import { makeStore } from '@/store/store'

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
	const [store] = useState(() =>
		makeStore({ traceActions: !!process.env.NEXT_PUBLIC_REDUX_TRACE })
	)

	return (
		<StyledComponentsRegistry>
			<NextJsNavigationProvider>
				<I18nextProvider i18n={i18n}>
					<ReduxProvider store={store}>
						<EmbeddedContextProvider>
							<DarkModeProvider darkModeParDéfaut={darkModeParDéfaut}>
								<DesignSystemThemeProvider>
									{children}
								</DesignSystemThemeProvider>
							</DarkModeProvider>
						</EmbeddedContextProvider>
					</ReduxProvider>
				</I18nextProvider>
			</NextJsNavigationProvider>
		</StyledComponentsRegistry>
	)
}
