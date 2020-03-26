// TODO : load translation only if en
import 'iframe-resizer'
import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import { getSessionStorage } from '../../utils'
import redirects from '../mon-entreprise.fr/redirects'
import Landing from './Landing'
import Studio from './LazyStudio'
import Mécanismes from './Mécanismes'

function Router({ language }) {
	useEffect(() => {
		getSessionStorage()?.setItem('lang', language)
	}, [language])
	const rules = language === 'en' ? rules : rules
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
				<Route exact path="/studio" component={Studio} />
				<Route exact path="/mécanismes" component={Mécanismes} />
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

let ExportedApp = Router

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Router)
}

export default ExportedApp
