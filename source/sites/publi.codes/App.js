import { rules as baseRulesEn, rulesFr as baseRulesFr } from 'Engine/rules'
import 'iframe-resizer'
import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import { getSessionStorage } from '../../utils'
import Landing from './Landing'

function Router({ basename, language }) {
	useEffect(() => {
		getSessionStorage()?.setItem('lang', language)
	}, [language])
	const rules = language === 'en' ? baseRulesEn : baseRulesFr
	return (
		<Provider
			basename={basename}
			language={language}
			reduxMiddlewares={[]}
			initialStore={{
				rules,
				simulation: {
					config: {
						objectifs: ['a']
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
				<Route exact path="/publicodes" component={Landing} />
				<Route exact path="/" component={Landing} />
			</Switch>
		</>
	)
}

let ExportedApp = Router

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Router)
}

export default ExportedApp
