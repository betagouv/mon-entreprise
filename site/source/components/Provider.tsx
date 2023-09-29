import { OverlayProvider } from '@react-aria/overlays'
import { ErrorBoundary } from '@sentry/react'
import i18next from 'i18next'
import { createContext, ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { ThemeColorsProvider } from '@/components/utils/colors'
import { DisableAnimationOnPrintProvider } from '@/components/utils/DisableAnimationContext'
import DesignSystemThemeProvider from '@/design-system/root'
import { EmbededContextProvider } from '@/hooks/useIsEmbedded'

import * as safeLocalStorage from '../storage/safeLocalStorage'
import { store } from '../store/store'
import { TrackingContext } from './ATInternetTracking'
import { createTracker } from './ATInternetTracking/Tracker'
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
	return (
		<EmbededContextProvider>
			<DarkModeProvider>
				<DesignSystemThemeProvider>
					<ErrorBoundary fallback={ErrorFallback}>
						<I18nextProvider i18n={i18next}>
							<ReduxProvider store={store}>
								<BrowserRouterProvider basename={basename}>
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
								</BrowserRouterProvider>
							</ReduxProvider>
						</I18nextProvider>
					</ErrorBoundary>
				</DesignSystemThemeProvider>
			</DarkModeProvider>
		</EmbededContextProvider>
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

	const ATTracker = createTracker(
		import.meta.env.VITE_AT_INTERNET_SITE_ID,
		safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
			navigator.doNotTrack === '1'
	)

	return (
		<HelmetProvider>
			<TrackingContext.Provider
				value={
					new ATTracker({
						language: i18next.language as 'fr' | 'en',
					})
				}
			>
				<BrowserRouter
					basename={import.meta.env.MODE === 'production' ? '' : basename}
					future={{ v7_startTransition: true }}
				>
					{children}
				</BrowserRouter>
			</TrackingContext.Provider>
		</HelmetProvider>
	)
}
