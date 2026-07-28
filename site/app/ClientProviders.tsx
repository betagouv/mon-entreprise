'use client'

import { ReactNode, Suspense, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
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
import { AvailableLang } from '@/locales/langue'
import { makeStore } from '@/store/store'

export function ClientProviders({
	children,
	langueParDéfaut,
}: {
	children: ReactNode
	langueParDéfaut: AvailableLang
}) {
	const [i18n] = useState(() => createI18nClient(langueParDéfaut))
	const [store] = useState(() =>
		makeStore({ traceActions: !!process.env.NEXT_PUBLIC_REDUX_TRACE })
	)

	return (
		<StyledComponentsRegistry>
			<Suspense>
				<HelmetProvider>
					<NextJsNavigationProvider>
						<I18nextProvider i18n={i18n}>
							<ReduxProvider store={store}>
								<EmbeddedContextProvider>
									<DarkModeProvider>
										<DesignSystemThemeProvider>
											{children}
										</DesignSystemThemeProvider>
									</DarkModeProvider>
								</EmbeddedContextProvider>
							</ReduxProvider>
						</I18nextProvider>
					</NextJsNavigationProvider>
				</HelmetProvider>
			</Suspense>
		</StyledComponentsRegistry>
	)
}
