import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { DesignSystemThemeProvider } from '@/design-system'
import { ReactRouterNavigationProvider } from '@/lib/navigation/providers/ReactRouterNavigationProvider'
import { englishCatalog } from '@/locales/englishCatalog'
import { createIsolatedI18n } from '@/locales/i18n'
import { AvailableLang } from '@/locales/langue'
import {
	applicationLanguage,
	declareLanguage,
} from '@/services/applicationLanguage'
import { makeStore } from '@/store/store'

export const TestProvider = ({
	children,
	langue = 'fr',
}: {
	children: ReactNode
	langue?: AvailableLang
}) => {
	const languageBefore = useRef(applicationLanguage())
	const i18n = useMemo(() => {
		declareLanguage(langue)

		return createIsolatedI18n(langue, {
			catalog: langue === 'en' ? englishCatalog : undefined,
		})
	}, [langue])
	const [store] = useState(() => makeStore())

	useEffect(() => () => declareLanguage(languageBefore.current), [])

	return (
		<HelmetProvider>
			<I18nextProvider i18n={i18n}>
				<ReduxProvider store={store}>
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
