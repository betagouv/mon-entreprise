import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import DevTools from './DevTools'
import { AppContainer } from 'react-hot-loader'
import debounceFormChangeActions from './debounceFormChangeActions'
import computeThemeColours from './components/themeColours'
import { getIframeOption, getUrl } from './utils'

import { rules, rulesFr } from 'Engine/rules'
import lang from './i18n'

import App from './containers/App.dev'

let initialStore = {
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur'))
}

let enhancer = compose(
	applyMiddleware(debounceFormChangeActions()),
	DevTools.instrument({ maxAge: 10 })
)

let initialRules = lang == 'en' ? rules : rulesFr
let store = createStore(reducers(initialRules), initialStore, enhancer)
let anchor = document.querySelector('#js')

render(<App store={store} />, anchor)

// Hot react component reloading. Unstable but helpful.
if (module.hot) {
	module.hot.accept('./containers/App.dev', () => {
		render(
			<AppContainer>
				<App store={store} />
			</AppContainer>,
			anchor
		)
	})
}

export { anchor }
