import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import reducers from './reducers/reducers'
import debounceFormChangeActions from './debounceFormChangeActions'
import computeThemeColours from './components/themeColours'
import { getIframeOption, getUrl } from './utils'
import { Provider } from 'react-redux'
import Layout from './containers/Layout'

import { rules, rulesFr } from 'Engine/rules'
import lang from './i18n'

let initialStore = {
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur'))
}

let enhancer = compose(applyMiddleware(debounceFormChangeActions()))

let initialRules = lang == 'en' ? rules : rulesFr
let store = createStore(reducers(initialRules), initialStore, enhancer)
let anchor = document.querySelector('#js')

render(
	<Provider store={store}>
		<Layout />
	</Provider>,
	anchor
)

export { anchor }
