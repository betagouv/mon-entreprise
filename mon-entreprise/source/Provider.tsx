import { ThemeColorsProvider } from 'Components/utils/colors'
import { SitePathProvider, SitePaths } from 'Components/utils/SitePathsContext'
import { TrackerProvider } from 'Components/utils/withTracker'
import { createBrowserHistory } from 'history'
import i18next from 'i18next'
import React, { createContext, useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers, { RootState } from 'Reducers/rootReducer'
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux'
import thunk from 'redux-thunk'
import Tracker from './Tracker'
import { inIframe } from './utils'

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
	}
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

if (
	process.env.NODE_ENV === 'production' &&
	'serviceWorker' in navigator &&
	!inIframe()
) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/sw.js')
			.then(registration => {
				// eslint-disable-next-line no-console
				console.log('SW registered: ', registration)
			})
			.catch(registrationError => {
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
	tracker?: Tracker
	sitePaths?: SitePaths
	initialStore?: RootState
	onStoreCreated?: (store: Store) => void
	reduxMiddlewares?: Array<Middleware>
}

export default function Provider({
	tracker = new Tracker(),
	basename,
	reduxMiddlewares,
	initialStore,
	onStoreCreated,
	children,
	sitePaths = {} as SitePaths
}: ProviderProps) {
	const history = useMemo(
		() =>
			createBrowserHistory({
				basename: process.env.NODE_ENV === 'production' ? '' : basename
			}),
		[]
	)
	useEffect(() => {
		tracker?.connectToHistory(history)
		return () => {
			tracker?.disconnectFromHistory()
		}
	})

	const storeEnhancer = composeEnhancers(
		applyMiddleware(
			// Allows us to painlessly do route transition in action creators
			thunk.withExtraArgument({
				history,
				sitePaths
			}),
			...(reduxMiddlewares ?? [])
		)
	)

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
	const iframeCouleur =
		new URLSearchParams(document?.location.search.substring(1)).get(
			'couleur'
		) ?? undefined

	return (
		// If IE < 11 display nothing
		<ReduxProvider store={store}>
			<ThemeColorsProvider
				color={iframeCouleur && decodeURIComponent(iframeCouleur)}
			>
				<TrackerProvider value={tracker}>
					<SiteNameContext.Provider value={basename}>
						<SitePathProvider value={sitePaths}>
							<I18nextProvider i18n={i18next}>
								<Router history={history}>
									<>{children}</>
								</Router>
							</I18nextProvider>
						</SitePathProvider>
					</SiteNameContext.Provider>
				</TrackerProvider>
			</ThemeColorsProvider>
		</ReduxProvider>
	)
}
