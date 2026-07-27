import { ReactNode, useMemo } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { DesignSystemThemeProvider } from '@/design-system'
import { ReactRouterNavigationProvider } from '@/lib/navigation'
import { createI18nClient } from '@/locales/i18n-client'
import { AvailableLang } from '@/locales/langue'
import { makeStore } from '@/store/store'

const testStore = makeStore()

export const TestProvider = ({
	children,
	langue = 'fr',
}: {
	children: ReactNode
	langue?: AvailableLang
}) => {
	const i18n = useMemo(() => createI18nClient(langue), [langue])

	return (
		<HelmetProvider>
			<I18nextProvider i18n={i18n}>
				<ReduxProvider store={testStore}>
					<DesignSystemThemeProvider>
						<BrowserRouter>
							<ReactRouterNavigationProvider>
								{children}
							</ReactRouterNavigationProvider>
						</BrowserRouter>
					</DesignSystemThemeProvider>
				</ReduxProvider>
			</I18nextProvider>
		</HelmetProvider>
	)
}
