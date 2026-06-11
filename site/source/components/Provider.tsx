import { ErrorBoundary } from '@sentry/react'
import i18next from 'i18next'
import { createContext, ReactNode, type JSX } from 'react'
import { OverlayProvider } from 'react-aria'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { PianoTrackerProvider } from '@/components/PianoAnalytics/PianoTrackerProvider'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { DisableAnimationOnPrintProvider } from '@/components/utils/DisableAnimationContext'
import { DesignSystemThemeProvider } from '@/design-system'
import { EmbeddedContextProvider } from '@/hooks/useIsEmbedded'
import { ReactRouterNavigationProvider } from '@/lib/navigation'

import { makeStore } from '../store/store'
import { ErrorFallback } from './ErrorPage'
import { IframeResizer } from './IframeResizer'
import { ServiceWorker } from './ServiceWorker'
import BrowserOnly from './utils/BrowserOnly'
import { DarkModeProvider } from './utils/DarkModeContext'

type SiteName = 'mon-entreprise' | 'infrance'

export const SiteNameContext = createContext<SiteName | null>(null)

export type ProviderProps = {
	basename: SiteName
	children: ReactNode
}

export default function Provider({
	basename,
	children,
}: ProviderProps): JSX.Element {
	const store = makeStore({ traceActions: !!import.meta.env.VITE_REDUX_TRACE })

	return (
		<DarkModeProvider>
			<I18nextProvider i18n={i18next}>
				<ReduxProvider store={store}>
					<BrowserRouterProvider basename={basename}>
						<EmbeddedContextProvider>
							<DesignSystemThemeProvider>
								<ErrorBoundary
									fallback={(errorData) => (
										// eslint-disable-next-line react/jsx-props-no-spreading
										<ErrorFallback {...errorData} showFeedbackForm />
									)}
								>
									{!import.meta.env.SSR && 'serviceWorker' in navigator && (
										<BrowserOnly>
											<ServiceWorker />
										</BrowserOnly>
									)}
									<IframeResizer />
									<OverlayProvider>
										<ThemeColorsProvider>
											<DisableAnimationOnPrintProvider>
												<SiteNameContext.Provider value={basename}>
													{children}
												</SiteNameContext.Provider>
											</DisableAnimationOnPrintProvider>
										</ThemeColorsProvider>
									</OverlayProvider>
								</ErrorBoundary>
							</DesignSystemThemeProvider>
						</EmbeddedContextProvider>
					</BrowserRouterProvider>
				</ReduxProvider>
			</I18nextProvider>
		</DarkModeProvider>
	)
}

function BrowserRouterProvider({
	children,
	basename,
}: {
	children: ReactNode
	basename: string
}) {
	// The server router is only provided in the entry-server file
	if (import.meta.env.SSR) {
		return <>{children}</>
	}

	return (
		<HelmetProvider>
			<PianoTrackerProvider>
				<BrowserRouter
					basename={import.meta.env.MODE === 'production' ? '' : basename}
					future={{ v7_startTransition: true }}
				>
					<ReactRouterNavigationProvider>
						{children}
					</ReactRouterNavigationProvider>
				</BrowserRouter>
			</PianoTrackerProvider>
		</HelmetProvider>
	)
}
