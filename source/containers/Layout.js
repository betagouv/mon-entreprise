import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'

import React, { Component } from 'react'
import './Layout.css'
import './reset.css'

import { Route, Router, Switch, Redirect } from 'react-router-dom'

import Home from 'Components/pages/Home'
import RulePage from 'Components/RulePage'
import Route404 from 'Components/Route404'
import Contact from 'Components/Contact'
import RulesList from 'Components/pages/RulesList'
import Mecanisms from 'Components/Mecanisms'
import Contribution from 'Components/pages/Contribution'
import Integration from 'Components/pages/Integration'
import About from 'Components/pages/About'
import ReactPiwik from 'Components/Tracker'
import createHistory from 'history/createBrowserHistory'
import { Header, Footer } from 'Components/pages/Header'
import { getIframeOption } from '../utils'

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

export default class Layout extends Component {
	history = createHistory()
	render() {
		// track the initial pageview
		ReactPiwik.push(['trackPageView'])
		return (
			<I18nextProvider i18n={i18next}>
				<Router history={piwik.connectToHistory(this.history)}>
					<>
						<Header />
						<Switch>
							<Route exact path="/" component={Home} />
							<Route path="/contact" component={Contact} />
							<Route path="/règle/:name" component={RulePage} />
							{/* Redirect to be removed in March (Google should have understood...)*/}
							<Route
								path="/regle/:name"
								render={({ match }) => (
									<Redirect to={`/règle/${match.params.name}`} />
								)}
							/>
							<Route path="/règles" component={RulesList} />
							<Route path="/mecanismes" component={Mecanisms} />
							<Route path="/à-propos" component={About} />
							<Route path="/intégrer" component={Integration} />
							<Route path="/contribuer" component={Contribution} />
							<Redirect from="/simulateur" to="/" />
							<Redirect from="/couleur.html" to="/" />
							<Route component={Route404} />
						</Switch>
						<Footer />
					</>
				</Router>
			</I18nextProvider>
		)
	}
}
