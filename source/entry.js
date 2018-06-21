/* global process: false */

import ReactPiwik from 'Components/Tracker'
import createHistory from 'history/createBrowserHistory'
import i18next from 'i18next'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import computeThemeColours from './components/themeColours'
import { defaultTracker, TrackerProvider } from './components/withTracker'
import Layout from './inFranceApp'
import trackDomainActions from './middlewares/trackDomainActions'
import reducers from './reducers/reducers'
import {
	persistSimulation,
	retrievePersistedSimulation
} from './storage/persist'
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
		decodeURIComponent(integratorUrl || 'https://embauche.beta.gouv.fr'),
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
let anchor = document.querySelector('#js')
persistSimulation(store)

const history = createHistory()

let App = ({ store }) => (
	<Provider store={store}>
		<TrackerProvider value={tracker}>
			<I18nextProvider i18n={i18next}>
				<Router history={tracker.connectToHistory(history)}>
					<Layout />
				</Router>
			</I18nextProvider>
		</TrackerProvider>
	</Provider>
)

render(<App store={store} />, anchor)

if (process.env.NODE_ENV !== 'production' && module.hot) {
	module.hot.accept('./containers/Layout', () => {
		render(
			<AppContainer>
				<App store={store} />
			</AppContainer>,
			anchor
		)
	})
}
export { anchor }
