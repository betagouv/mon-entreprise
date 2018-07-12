import { defaultTracker, TrackerProvider } from 'Components/utils/withTracker'
import createHistory from 'history/createBrowserHistory'
import i18next from 'i18next'
import React, { PureComponent } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import reducers from 'Reducers/rootReducer'
import { applyMiddleware, compose, createStore } from 'redux'
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
let enhancer = composeEnhancers(applyMiddleware(trackDomainActions(tracker)))

let store = createStore(reducers, initialStore, enhancer)
persistSimulation(store)
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
	state = {
		history: createHistory({
			basename: process.env.NODE_ENV === 'production' ? '' : this.props.basename
		})
	}
	render() {
		return (
			<Provider store={store}>
				<TrackerProvider value={tracker}>
					<I18nextProvider i18n={i18next}>
						<Router history={tracker.connectToHistory(this.state.history)}>
							<>{this.props.children}</>
						</Router>
					</I18nextProvider>
				</TrackerProvider>
			</Provider>
		)
	}
}
