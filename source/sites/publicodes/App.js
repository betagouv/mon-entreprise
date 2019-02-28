import RulePage from 'Components/RulePage'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import Route404 from 'Components/Route404'
import RulesList from '../embauche.gouv.fr/pages/RulesList'
import sitePaths from './sitePaths'
import Landing from './Landing'
import Simulateur from './Simulateur'
import About from './About'

class App extends Component {
	render() {
		return (
			<Provider
				basename="publicodes"
				rulesConfig={{
					repo: 'laem/futureco-data',
					filePath: 'co2.yaml'
				}}
				sitePaths={sitePaths()}
				reduxMiddlewares={[]}>
				<Switch>
					<Route exact path="/" component={Landing} />
					<Route path="/documentation/:name" component={RulePage} />
					<Route path="/documentation" component={RulesList} />
					<Route path="/simulateur/:name" component={Simulateur} />
					<Route path="/à-propos" component={About} />
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
