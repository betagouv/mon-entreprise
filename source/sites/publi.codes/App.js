import { rules as baseRulesEn, rulesFr as baseRulesFr } from 'Engine/rules'
import 'iframe-resizer'
import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import { getSessionStorage } from '../../utils'
import redirects from '../mon-entreprise.fr/redirects'
import Landing from './Landing'
import Studio from './LazyStudio'

function Router({ language }) {
	useEffect(() => {
		getSessionStorage()?.setItem('lang', language)
	}, [language])
	const rules = language === 'en' ? baseRulesEn : baseRulesFr
	return (
		<Provider
			basename="publicodes"
			language={language}
			reduxMiddlewares={[]}
			initialStore={{
				rules,
				simulation: {
					config: {
						objectifs: []
					}
				}
			}}
		>
			<RouterSwitch />
		</Provider>
	)
}

let RouterSwitch = () => {
	return (
		<>
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route exact path="/Studio" component={Studio} />
				<Route component={App} />
			</Switch>
		</>
	)
}

const App = () => {
	return (
		<div className="app-content">
			<div className="ui__ container" style={{ flexGrow: 1, flexShrink: 0 }}>
				<Switch>{redirects}</Switch>
			</div>
		</div>
	)
}

export default Router
