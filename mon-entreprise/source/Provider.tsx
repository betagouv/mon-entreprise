import { OverlayProvider } from '@react-aria/overlays'
import { ErrorBoundary } from '@sentry/react'
import { ThemeColorsProvider } from 'Components/utils/colors'
import { DisableAnimationOnPrintProvider } from 'Components/utils/DisableAnimationContext'
import { IsEmbeddedProvider } from 'Components/utils/embeddedContext'
import { SitePathProvider, SitePaths } from 'Components/utils/SitePathsContext'
import { GlobalStyle } from 'DesignSystem/global-style'
import { Container } from 'DesignSystem/layout'
import DesignSystemThemeProvider from 'DesignSystem/root'
import { H1 } from 'DesignSystem/typography/heading'
import { createBrowserHistory } from 'history'
import i18next from 'i18next'
import 'iframe-resizer'
import React, { createContext, useMemo } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers, { RootState } from 'Reducers/rootReducer'
import {
	applyMiddleware,
	compose,
	createStore,
	Middleware,
	PreloadedState,
	Store,
} from 'redux'
// ATInternet Tracking
import { TrackingContext } from './ATInternetTracking'
import { createTracker } from './ATInternetTracking/Tracker'
import logo from './static/images/logo.svg'
import safeLocalStorage from './storage/safeLocalStorage'
import { inIframe } from './utils'

const ATTracker = createTracker(
	process.env.AT_INTERNET_SITE_ID,
	safeLocalStorage.getItem('tracking:do_not_track') === '1' ||
		navigator.doNotTrack === '1'
)

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
	}
}
if (process.env.REDUX_TRACE) {
	console.log('going to trace')
}
const composeEnhancers =
	(process.env.REDUX_TRACE
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
		  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				trace: true,
				traceLimit: 25,
		  })
		: window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

if (
	process.env.NODE_ENV === 'production' &&
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
	children: React.ReactNode
	sitePaths?: SitePaths
	initialStore?: PreloadedState<RootState>
	onStoreCreated?: (store: Store) => void
	reduxMiddlewares?: Array<Middleware>
}

export default function Provider({
	basename,
	reduxMiddlewares = [],
	initialStore,
	onStoreCreated,
	children,
	sitePaths = {} as SitePaths,
}: ProviderProps) {
	const history = useMemo(
		() =>
			createBrowserHistory({
				basename: process.env.NODE_ENV === 'production' ? '' : basename,
			}),
		[]
	)

	const storeEnhancer = composeEnhancers(applyMiddleware(...reduxMiddlewares))

	// Hack: useMemo is used to persist the store across hot reloads.
	const store = useMemo(() => {
		return createStore(reducers, initialStore, storeEnhancer)
	}, [])
	onStoreCreated?.(store)

	// Remove loader
	const css = document.createElement('style')
	css.type = 'text/css'
	css.innerHTML = `
#js {
	animation: appear 0.5s;
	opacity: 1;
}
#loading {
	display: none !important;
}`
	document.body.appendChild(css)
	// Note that the iframeColor is first set in the index.html file, but without
	// the full palette generation that happen here. This is to prevent a UI
	// flash, cf. #1786.
	const rawCouleur = new URLSearchParams(
		document.location.search.substring(1)
	).get('couleur')
	const iframeCouleur: [number, number, number] | undefined =
		rawCouleur && JSON.parse(decodeURIComponent(rawCouleur))

	return (
		<>
			<GlobalStyle />
			<ErrorBoundary
				showDialog
				fallback={
					<>
						<Container>
							<img
								src={logo}
								alt="logo"
								style={{ maxWidth: '200px', width: '100%', marginTop: '1rem' }}
							></img>
							<H1>Une erreur est survenue</H1>
							<p>
								L'équipe technique de mon-entreprise.fr a été automatiquement
								prévenue. Vous pouvez également nous contacter directement à
								l'adresse{' '}
								<a href="mailto:contact@mon-entreprise.beta.gouv.fr">
									contact@mon-entreprise.beta.gouv.fr
								</a>{' '}
								si vous souhaitez partager une remarque.
							</p>
							<p>Veuillez nous excuser pour la gêne occasionnée.</p>
						</Container>
					</>
				}
			>
				<ReduxProvider store={store}>
					<DesignSystemThemeProvider>
						<ThemeColorsProvider color={iframeCouleur}>
							<TrackingContext.Provider
								value={
									new ATTracker({
										language: i18next.language as 'fr' | 'en',
									})
								}
							>
								<DisableAnimationOnPrintProvider>
									<IsEmbeddedProvider>
										<SiteNameContext.Provider value={basename}>
											<SitePathProvider value={sitePaths}>
												<I18nextProvider i18n={i18next}>
													<HelmetProvider>
														<OverlayProvider>
															<Router history={history}>
																<>{children}</>
															</Router>
														</OverlayProvider>
													</HelmetProvider>
												</I18nextProvider>
											</SitePathProvider>
										</SiteNameContext.Provider>
									</IsEmbeddedProvider>
								</DisableAnimationOnPrintProvider>
							</TrackingContext.Provider>
						</ThemeColorsProvider>
					</DesignSystemThemeProvider>
				</ReduxProvider>
			</ErrorBoundary>
		</>
	)
}
