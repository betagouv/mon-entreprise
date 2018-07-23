import { defaultTracker, TrackerProvider } from 'Components/utils/withTracker'
import createHistory from 'history/createBrowserHistory'
import i18next from 'i18next'
import React, { PureComponent } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers from 'Reducers/rootReducer'
import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import computeThemeColours from 'Ui/themeColours'
import trackDomainActions from './middlewares/trackDomainActions'
import {
	persistSimulation,
	retrievePersistedSimulation
} from './storage/persist'
import ReactPiwik from './Tracker'
import { getIframeOption, getUrl } from './utils'

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
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur')),
	previousSimulation: retrievePersistedSimulation()
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

if (process.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
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
				trackDomainActions(tracker)
			)
		)
		this.store = createStore(reducers, initialStore, storeEnhancer)
		persistSimulation(this.store)
	}
	render() {
		return (
			<Provider store={this.store}>
				<TrackerProvider value={tracker}>
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
