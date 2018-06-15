/* global process: false */

import ReactPiwik from 'Components/Tracker'
import { rules, rulesFr } from 'Engine/rules'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import computeThemeColours from './components/themeColours'
import Layout from './containers/Layout'
import lang from './i18n'
import trackDomainActions from './middlewares/trackDomainActions'
import reducers from './reducers/reducers'
import {
	persistSimulation,
	retrievePersistedSimulation
} from './storage/persist'
import { getIframeOption, getUrl } from './utils'

let tracker = {
	push: console.log,
	connectToHistory: history => history
}
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

// let initialRules = lang == 'en' ? rules : rulesFr
//TODO reintroduce initial language
//
let store = createStore(reducers, initialStore, enhancer)
let anchor = document.querySelector('#js')
persistSimulation(store)

let App = ({ store }) => (
	<Provider store={store}>
		<Layout tracker={tracker} />
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
