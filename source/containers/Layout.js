import React, { Component } from 'react'
import './Layout.css'
import './reset.css'

import { Route, Router, Switch, Redirect } from 'react-router-dom'

import Home from 'Components/pages/Home'
import RulePage from 'Components/RulePage'
import Route404 from 'Components/Route404'
import Contact from 'Components/Contact'
import Simulateur from 'Components/Simulateur'
import RulesList from 'Components/pages/RulesList'
import Mecanisms from 'Components/Mecanisms'
import Contribution from 'Components/pages/Contribution'
import Integration from 'Components/pages/Integration'
import About from 'Components/pages/About'
import ReactPiwik from 'Components/Tracker'
import createHistory from 'history/createBrowserHistory'
import Header from 'Components/pages/Header'

const piwik = new ReactPiwik({
	url: 'stats.data.gouv.fr',
	siteId: 39,
	trackErrors: true
})

export default class Layout extends Component {
	history = createHistory()
	render() {
		// track the initial pageview
		ReactPiwik.push(['trackPageView'])

		return (
			<Router history={piwik.connectToHistory(this.history)}>
				<>
					<Header />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route path="/contact" component={Contact} />
						<Route path="/regle/:name" component={RulePage} />
						<Route path="/regles" component={RulesList} />
						<Route path="/mecanismes" component={Mecanisms} />
						<Redirect from="/simu/surcoût-CDD/intro" to="/" />
						<Redirect from="/simu/surcoût-CDD" to="/" />
						<Route path="/simu/:targets" component={Simulateur} />
						<Route path="/à-propos" component={About} />
						<Route path="/intégrer" component={Integration} />
						<Route path="/contribuer" component={Contribution} />
						<Redirect from="/simu/" to="/" />
						<Redirect from="/simulateur" to="/" />
						<Redirect from="/iframe.html" to="/" />
						<Redirect from="/couleur.html" to="/" />
						<Route component={Route404} />
					</Switch>
				</>
			</Router>
		)
	}
}
