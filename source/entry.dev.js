import { rules, rulesFr } from 'Engine/rules'
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import DevTools from './DevTools'
import computeThemeColours from './components/themeColours'
import Layout from './containers/Layout'
import lang from './i18n'
import debounceFormChangeActions from './middlewares/debounceFormChangeActions'
import trackDomainActions from './middlewares/trackDomainActions'
import reducers from './reducers/reducers'
import {
	persistSimulation,
	retrievePersistedSimulation
} from './storage/persist'
import { getIframeOption, getUrl } from './utils'

let initialState = {
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur')),
	previousSimulation: retrievePersistedSimulation()
}

let tracker = {
	push: console.log,
	connectToHistory: history => history
}
let enhancer = compose(
	applyMiddleware(debounceFormChangeActions(), trackDomainActions(tracker)),
	DevTools.instrument({ maxAge: 10 })
)

let initialRules = lang == 'en' ? rules : rulesFr
let store = createStore(reducers(initialRules), initialState, enhancer)
let anchor = document.querySelector('#js')

persistSimulation(store)

let App = ({ store }) => (
	<Provider store={store}>
		<div id="dev">
			<Layout tracker={tracker} />
			<DevTools />
		</div>
	</Provider>
)

render(<App store={store} />, anchor)

// Hot react component reloading. Unstable but helpful.
if (module.hot) {
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
