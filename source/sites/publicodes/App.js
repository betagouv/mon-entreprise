import RulePage from 'Components/RulePage'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import Route404 from '../embauche.gouv.fr/pages/Route404'
import RulesList from '../embauche.gouv.fr/pages/RulesList'
import sitePaths from './sitePaths'

class App extends Component {
	render() {
		return (
			<Provider
				basename="publicodes"
				rulesConfig={{
					repo: 'laem/publi.codes',
					filePath: 'co2.yaml'
				}}
				sitePaths={sitePaths()}
				initialStore={{ targetNames: ['transport . impact'] }}
				reduxMiddlewares={[]}>
				<Switch>
					<Route path="/documentation/:name" component={RulePage} />
					<Route exact path="/" component={RulesList} />
					<Route component={Route404} />
				</Switch>
			</Provider>
		)
	}
}

let devMode = process.env.NODE_ENV !== 'production'
export default (devMode
	? do {
			let { hot } = require('react-hot-loader')
			hot(module)(App)
	  }
	: App)
