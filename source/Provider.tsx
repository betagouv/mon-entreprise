import { ThemeColoursProvider } from 'Components/utils/withColours'
import { SitePathProvider, SitePaths } from 'Components/utils/withSitePaths'
import { TrackerProvider } from 'Components/utils/withTracker'
import { createBrowserHistory, History } from 'history'
import { AvailableLangs } from 'i18n'
import i18next from 'i18next'
import React, { PureComponent } from 'react'
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

type ProviderProps = {
	tracker: Tracker
	basename: string
	sitePaths: SitePaths
	language: AvailableLangs
	initialStore: RootState
	onStoreCreated: (store: Store) => void
	reduxMiddlewares: Array<Middleware>
}

export default class Provider extends PureComponent<ProviderProps> {
	history: History
	store: Store
	constructor(props: ProviderProps) {
		super(props)
		this.history = createBrowserHistory({
			basename: process.env.NODE_ENV === 'production' ? '' : this.props.basename
		})
		this.props.tracker?.connectToHistory(this.history)
		const storeEnhancer = composeEnhancers(
			applyMiddleware(
				// Allows us to painlessly do route transition in action creators
				thunk.withExtraArgument({
					history: this.history,
					sitePaths: this.props.sitePaths
				}),
				...props.reduxMiddlewares
			)
		)
		if (this.props.language) {
			i18next.changeLanguage(this.props.language)
			if (this.props.initialStore)
				this.props.initialStore.lang = this.props.language
		}
		this.store = createStore(reducers, this.props.initialStore, storeEnhancer)
		this.props.onStoreCreated?.(this.store)

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
	}
	componentWillUnmount() {
		this.props.tracker.disconnectFromHistory()
	}
	render() {
		const iframeCouleur =
			new URLSearchParams(document?.location.search.substring(1)).get(
				'couleur'
			) ?? undefined
		return (
			// If IE < 11 display nothing
			<ReduxProvider store={this.store}>
				<ThemeColoursProvider
					colour={iframeCouleur && decodeURIComponent(iframeCouleur)}
				>
					<TrackerProvider value={this.props.tracker}>
						<SitePathProvider value={this.props.sitePaths}>
							<I18nextProvider i18n={i18next}>
								<Router history={this.history}>
									<>{this.props.children}</>
								</Router>
							</I18nextProvider>
						</SitePathProvider>
					</TrackerProvider>
				</ThemeColoursProvider>
			</ReduxProvider>
		)
	}
}
