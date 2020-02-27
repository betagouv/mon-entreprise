import { ThemeColorsProvider } from 'Components/utils/colors'
import { SitePathProvider, SitePaths } from 'Components/utils/withSitePaths'
import { TrackerProvider } from 'Components/utils/withTracker'
import { createBrowserHistory } from 'history'
import { AvailableLangs } from 'i18n'
import i18next from 'i18next'
import React, { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers, { RootState } from 'Reducers/rootReducer'
import { applyMiddleware, compose, createStore, Middleware, Store } from 'redux'
import thunk from 'redux-thunk'
import Tracker from 'Tracker'
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

export type ProviderProps = {
	basename: string
	language: AvailableLangs
	children: React.ReactNode
	tracker?: Tracker
	sitePaths?: SitePaths
	initialStore?: RootState
	onStoreCreated?: (store: Store) => void
	reduxMiddlewares?: Array<Middleware>
}

export default function Provider({
	tracker,
	basename,
	sitePaths,
	reduxMiddlewares,
	language,
	initialStore,
	onStoreCreated,
	children
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
	useEffect(() => {
		if (language) {
			i18next.changeLanguage(language)
		}
	}, [])
	if (language && initialStore) initialStore.lang = language
	const store = createStore(reducers, initialStore, storeEnhancer)
	onStoreCreated?.(store)

	// Remove loader
	var css = document.createElement('style')
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
				<TrackerProvider value={tracker!}>
					<SitePathProvider value={sitePaths as any}>
						<I18nextProvider i18n={i18next}>
							<Router history={history}>
								<>{children}</>
							</Router>
						</I18nextProvider>
					</SitePathProvider>
				</TrackerProvider>
			</ThemeColorsProvider>
		</ReduxProvider>
	)
}
