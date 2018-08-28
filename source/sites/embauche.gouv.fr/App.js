import Mecanisms from 'Components/Mecanisms'
import RulePage from 'Components/RulePage'
import TrackPageView from 'Components/utils/TrackPageView'
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation
} from '../../storage/persistSimulation'
import About from './pages/About'
import Contact from './pages/Contact'
import Contribution from './pages/Contribution'
import Couleur from './pages/Couleur'
import { Header } from './pages/Header'
import Home from './pages/Home'
import Integration from './pages/Integration'
import IntegrationTest from './pages/IntegrationTest'
import Route404 from './pages/Route404'
import RulesList from './pages/RulesList'

class EmbaucheRoute extends Component {
	render() {
		return (
			<Provider
				basename="embauche"
				initialStore={{
					previousSimulation: retrievePersistedSimulation()
				}}
				onStoreCreated={persistSimulation}>
				<TrackPageView />
				<Header />
				<Switch>
					<Route exact path="/" component={Home} />
					<Route path="/contact" component={Contact} />
					<Route path="/règle/:name" component={RulePage} />
					<Redirect from="/simu/*" to="/" />
					<Route path="/règles" component={RulesList} />
					<Route path="/mecanismes" component={Mecanisms} />
					<Route path="/à-propos" component={About} />
					<Route path="/intégrer" component={Integration} />
					<Route path="/contribuer" component={Contribution} />
					<Route path="/couleur" component={Couleur} />
					<Route path="/integration-test" component={IntegrationTest} />
					<Redirect from="/simulateur" to="/" />
					<Route component={Route404} />
				</Switch>
			</Provider>
		)
	}
}

let ExportedApp = EmbaucheRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(EmbaucheRoute)
}

export default ExportedApp
