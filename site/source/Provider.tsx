import { OverlayProvider } from '@react-aria/overlays'
import { ErrorBoundary } from '@sentry/react'
import { ThemeColorsProvider } from '@/components/utils/colors'
import { DisableAnimationOnPrintProvider } from '@/components/utils/DisableAnimationContext'
import { IsEmbeddedProvider } from '@/components/utils/embeddedContext'
import {
	SitePathProvider,
	SitePaths,
} from '@/components/utils/SitePathsContext'
import { GlobalStyle } from '@/design-system/global-style'
import { Container } from '@/design-system/layout'
import DesignSystemThemeProvider from '@/design-system/root'
import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { createBrowserHistory } from 'history'
import i18next from 'i18next'
import logo from '@/images/logo-monentreprise.svg'
import { useIframeResizer } from '@/hooks/useIframeResizer'
import { createContext, ReactNode, useMemo } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'react-router-dom'
import { inIframe } from './utils'
import { store } from './store'
import * as safeLocalStorage from './storage/safeLocalStorage'

// ATInternet Tracking
import { TrackingContext } from './ATInternetTracking'
import { createTracker } from './ATInternetTracking/Tracker'

if (
	!import.meta.env.SSR &&
	import.meta.env.MODE === 'production' &&
	'serviceWorker' in navigator &&
	!inIframe()
) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js')
			.then((registration) => {
				// eslint-disable-next-line no-console
				console.log('SW registered: ', registration)
			})
			.catch((registrationError) => {
				// eslint-disable-next-line no-console
				console.log('SW registration failed: ', registrationError)
			})
	})
}

type SiteName = 'mon-entreprise' | 'infrance' | 'publicodes'

export const SiteNameContext = createContext<SiteName | null>(null)

export type ProviderProps = {
	basename: SiteName
	children: ReactNode
	sitePaths?: SitePaths
}

export default function Provider({
	basename,
	children,
	sitePaths = {} as SitePaths,
}: ProviderProps): JSX.Element {
	useIframeResizer()

	return (
		<DesignSystemThemeProvider>
			<GlobalStyle />
			<ErrorBoundary
				showDialog
				fallback={
					<Container>
						<Link href={sitePaths.index}>
							<img
								src={logo}
								alt="logo service mon-entreprise urssaf"
								style={{
									maxWidth: '200px',
									width: '100%',
									marginTop: '1rem',
								}}
							></img>
						</Link>
						<H1>Une erreur est survenue</H1>
						<Intro>
							L'équipe technique mon-entreprise a été automatiquement prévenue.
						</Intro>
						<Body>
							Vous pouvez également nous contacter directement à l'adresse{' '}
							<Link href="mailto:contact@mon-entreprise.beta.gouv.fr">
								contact@mon-entreprise.beta.gouv.fr
							</Link>{' '}
							si vous souhaitez partager une remarque. Veuillez nous excuser
							pour la gêne occasionnée.
						</Body>
					</Container>
				}
			>
				<OverlayProvider>
					<ReduxProvider store={store}>
						<IsEmbeddedProvider>
							<ThemeColorsProvider>
								<DisableAnimationOnPrintProvider>
									<SiteNameContext.Provider value={basename}>
										<SitePathProvider value={sitePaths}>
											<I18nextProvider i18n={i18next}>
												<BrowserRouterProvider basename={basename}>
													<>{children}</>
												</BrowserRouterProvider>
											</I18nextProvider>
										</SitePathProvider>
									</SiteNameContext.Provider>
								</DisableAnimationOnPrintProvider>
							</ThemeColorsProvider>
						</IsEmbeddedProvider>
					</ReduxProvider>
				</OverlayProvider>
			</ErrorBoundary>
		</DesignSystemThemeProvider>
	)
}

function BrowserRouterProvider({
	children,
	basename,
}: {
	children: ReactNode
	basename: string
}) {
	// The server rouer is only provided in the entry-server file
	if (import.meta.env.SSR) {
		return <>{children}</>
	}
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const history = useMemo(
		() =>
			createBrowserHistory({
				basename: import.meta.env.MODE === 'production' ? '' : basename,
			}),
		[basename]
	)

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
				<Router history={history}>
					<>{children}</>
				</Router>
			</TrackingContext.Provider>
		</HelmetProvider>
	)
}
