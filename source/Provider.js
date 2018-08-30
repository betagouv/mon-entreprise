import SetCSSColour from 'Components/utils/SetCssColour'
import { defaultTracker, TrackerProvider } from 'Components/utils/withTracker'
import createHistory from 'history/createBrowserHistory'
import i18next from 'i18next'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import React, { PureComponent } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers from 'Reducers/rootReducer'
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import computeThemeColours from 'Ui/themeColours'
import trackDomainActions from './middlewares/trackDomainActions'
import ReactPiwik from './Tracker'
import { getIframeOption, inIframe } from './utils'

if (process.env.NODE_ENV === 'production') {
	Raven.config(
		'https://9051375f856646d694943532caf2b45f@sentry.data.gouv.fr/18'
	).install()
}

let tracker = defaultTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new ReactPiwik({
		url: 'stats.data.gouv.fr',
		siteId: 39,
		trackErrors: true
	})
}

if (process.env.NODE_ENV === 'production') {
	let integratorUrl = getIframeOption('integratorUrl')
	ReactPiwik.push([
		'setCustomVariable',
		1,
		'urlPartenaire',
		decodeURIComponent(integratorUrl || location.origin),
		'visit'
	])
}

let initialStore = {
	themeColours: computeThemeColours(getIframeOption('couleur'))
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
				console.log('SW registered: ', registration)
			})
			.catch(registrationError => {
				console.log('SW registration failed: ', registrationError)
			})
	})
}

export default class Layout extends PureComponent {
	constructor(props) {
		super(props)
		this.history = createHistory({
			basename: process.env.NODE_ENV === 'production' ? '' : this.props.basename
		})
		const storeEnhancer = composeEnhancers(
			applyMiddleware(
				// Allows us to painlessly do route transition in action creators
				thunk.withExtraArgument(this.history),
				createRavenMiddleware(Raven),
				trackDomainActions(tracker)
			)
		)
		this.store = createStore(
			reducers,
			{ ...initialStore, ...this.props.initialStore },
			storeEnhancer
		)
		this.props.onStoreCreated(this.store)
		if (this.props.language) {
			i18next.changeLanguage(this.props.language)
		}
	}
	render() {
		return (
			<Provider store={this.store}>
				<TrackerProvider value={tracker}>
					<SetCSSColour />
					<I18nextProvider i18n={i18next}>
						<Router history={tracker.connectToHistory(this.history)}>
							<>{this.props.children}</>
						</Router>
					</I18nextProvider>
				</TrackerProvider>
			</Provider>
		)
	}
}
