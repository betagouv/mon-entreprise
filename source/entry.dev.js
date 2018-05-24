import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import reducers from './reducers/reducers'
import DevTools from './DevTools'
import { Provider } from 'react-redux'
import Layout from './containers/Layout'
import { AppContainer } from 'react-hot-loader'
import { persistState, retrievePersistedState } from './storage/persist'
import debounceFormChangeActions from './debounceFormChangeActions'
import computeThemeColours from './components/themeColours'
import { getIframeOption, getUrl } from './utils'

import { rules, rulesFr } from 'Engine/rules'
import lang from './i18n'

let initialState = {
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur')),
	...retrievePersistedState()
}

let enhancer = compose(
	applyMiddleware(debounceFormChangeActions()),
	DevTools.instrument({ maxAge: 10 })
)

let tracker = {
	push: console.log,
	connectToHistory: history => history
}

let initialRules = lang == 'en' ? rules : rulesFr
let store = createStore(reducers(tracker, initialRules), initialState, enhancer)
let anchor = document.querySelector('#js')

persistState(store)

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
