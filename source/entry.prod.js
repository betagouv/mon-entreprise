import ReactPiwik from 'Components/Tracker'
import { rules, rulesFr } from 'Engine/rules'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import computeThemeColours from './components/themeColours'
import Layout from './containers/Layout'
import lang from './i18n'
import debounceFormChangeActions from './middlewares/debounceFormChangeActions'
import trackDomainActions from './middlewares/trackDomainActions'
import reducers from './reducers/reducers'
import { getIframeOption, getUrl } from './utils'

const piwik = new ReactPiwik({
	url: 'stats.data.gouv.fr',
	siteId: 39,
	trackErrors: true
})
let integratorUrl = getIframeOption('integratorUrl')
ReactPiwik.push([
	'setCustomVariable',
	1,
	'urlPartenaire',
	decodeURIComponent(integratorUrl || 'https://embauche.beta.gouv.fr'),
	'visit'
])

let initialStore = {
	iframe: getUrl().includes('iframe'),
	themeColours: computeThemeColours(getIframeOption('couleur'))
}

let enhancer = compose(
	applyMiddleware(debounceFormChangeActions(), trackDomainActions(piwik))
)

let initialRules = lang == 'en' ? rules : rulesFr
let store = createStore(reducers(initialRules), initialStore, enhancer)
let anchor = document.querySelector('#js')

render(
	<Provider store={store}>
		<Layout tracker={piwik} />
	</Provider>,
	anchor
)

export { anchor }
