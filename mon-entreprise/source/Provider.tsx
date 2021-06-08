import { ErrorBoundary } from '@sentry/react'
import { ThemeColorsProvider } from 'Components/utils/colors'
import HSL from "Components/utils/color/HSL"
import { SitePathProvider, SitePaths } from 'Components/utils/SitePathsContext'
import { createBrowserHistory } from 'history'
import i18next from 'i18next'
import React, { createContext, useMemo } from 'react'
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
	const iframeCouleurParam =
	new URLSearchParams(document?.location.search.substring(1)).get(
		'couleur'
		)
		
	const iframeCouleur = iframeCouleurParam ? new HSL(iframeCouleurParam) : undefined

	return (
		<ErrorBoundary
			showDialog
			fallback={
				<>
					<div className="ui__ container">
						<img
							src={logo}
							style={{ maxWidth: '200px', width: '100%', marginTop: '1rem' }}
						></img>
						<h1>Une erreur est survenue</h1>
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
					</div>
				</>
			}
		>
			<ReduxProvider store={store}>
				<ThemeColorsProvider
					color={iframeCouleur}
				>
					<TrackingContext.Provider
						value={
							new ATTracker({
								language: i18next.language as 'fr' | 'en',
							})
						}
					>
						<SiteNameContext.Provider value={basename}>
							<SitePathProvider value={sitePaths}>
								<I18nextProvider i18n={i18next}>
									<Router history={history}>
										<>{children}</>
									</Router>
								</I18nextProvider>
							</SitePathProvider>
						</SiteNameContext.Provider>
					</TrackingContext.Provider>
				</ThemeColorsProvider>
			</ReduxProvider>
		</ErrorBoundary>
	)
}
