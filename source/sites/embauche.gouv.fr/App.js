import PageFeedback from 'Components/Feedback/PageFeedback'
import Mecanisms from 'Components/Mecanisms'
import ExampleSituations from './pages/ExampleSituations'
import RulePage from 'Components/RulePage'
import DisableScroll from 'Components/utils/DisableScroll'
import TrackPageView from 'Components/utils/TrackPageView'
import { defaultTracker } from 'Components/utils/withTracker'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import {
	persistSimulation,
	retrievePersistedSimulation
} from '../../storage/persistSimulation'
import ReactPiwik from '../../Tracker'
import { getIframeOption, inIframe } from '../../utils'
import trackDomainActions from './middlewares/trackDomainActions'
import About from './pages/About'
import Contact from './pages/Contact'
import Contribution from './pages/Contribution'
import Couleur from './pages/Couleur'
import { Header } from './pages/Header'
import Home from './pages/Home'
import IframeFooter from './pages/IframeFooter'
import Integration from './pages/Integration'
import IntegrationTest from './pages/IntegrationTest'
import Route404 from './pages/Route404'
import RulesList from './pages/RulesList'

if (process.env.NODE_ENV === 'production') {
	Raven.config(
		'https://9051375f856646d694943532caf2b45f@sentry.data.gouv.fr/18'
	).install()
}

let tracker = defaultTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new ReactPiwik({
		url: 'stats.data.gouv.fr',
		siteId: 39,
		trackErrors: true
	})
}

if (process.env.NODE_ENV === 'production') {
	let integratorUrl = getIframeOption('integratorUrl')
	ReactPiwik.push([
		'setCustomVariable',
		1,
		'urlPartenaire',
		decodeURIComponent(integratorUrl || location.origin),
		'visit'
	])
}

const middlewares = [createRavenMiddleware(Raven), trackDomainActions(tracker)]

class EmbaucheRoute extends Component {
	render() {
		return (
			<Provider
				basename="embauche"
				initialStore={{
					previousSimulation: retrievePersistedSimulation()
				}}
				reduxMiddlewares={middlewares}
				tracker={tracker}
				onStoreCreated={persistSimulation}>
				<TrackPageView />
				{!inIframe() && <Header />}
				{inIframe() && <DisableScroll />}
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/simulation" component={Home} />
					<Route path="/contact" component={Contact} />
					<Route path="/règle/:name" component={RulePage} />
					<Redirect from="/simu/*" to="/" />
					<Route path="/règles" component={RulesList} />
					<Route path="/exemples" component={ExampleSituations} />
					<Route path="/mecanismes" component={Mecanisms} />
					<Route path="/à-propos" component={About} />
					<Route path="/intégrer" component={Integration} />
					<Route path="/contribuer" component={Contribution} />
					<Route path="/couleur" component={Couleur} />
					<Route path="/integration-test" component={IntegrationTest} />
					<Redirect from="/simulateur" to="/" />
					<Route component={Route404} />
				</Switch>
				<PageFeedback blacklist={['/', '/simulation']} />
				{inIframe() && <IframeFooter />}
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
