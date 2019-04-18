import Route404 from 'Components/Route404'
import TrackPageView from 'Components/utils/TrackPageView'
import withSitePaths from 'Components/utils/withSitePaths'
import { defaultTracker } from 'Components/utils/withTracker'
import 'iframe-resizer'
import { compose } from 'ramda'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import {
	persistEverything,
	retrievePersistedState
} from '../../storage/persistEverything'
import {
	persistSimulation,
	retrievePersistedSimulation
} from '../../storage/persistSimulation'
import ReactPiwik from '../../Tracker'
import { inIframe } from '../../utils'
import './App.css'
import Footer from './layout/Footer/Footer'
import Header from './layout/Header/Header'
import Navigation from './layout/Navigation/Navigation'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import CompanyIndex from './pages/Company'
import IntegrationTest from './pages/Dev/IntegrationTest'
import Sitemap from './pages/Dev/Sitemap'
import Documentation from './pages/Documentation'
import HiringProcess from './pages/HiringProcess'
import Iframes from './pages/Iframes'
import Landing from './pages/Landing'
import SocialSecurity from './pages/SocialSecurity'
import { constructLocalizedSitePath } from './sitePaths'

if (process.env.NODE_ENV === 'production') {
	Raven.config(
		'https://87763bb809954756b442bc93b5051ed6@sentry.data.gouv.fr/22'
	).install()
}

let tracker = defaultTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new ReactPiwik({
		url: 'stats.data.gouv.fr',
		siteId: 66,
		trackErrors: true
	})
}

const middlewares = [
	createRavenMiddleware(Raven),
	trackSimulatorActions(tracker)
]

class InFranceRoute extends Component {
	componentDidMount() {
		if (typeof sessionStorage !== 'undefined') {
			sessionStorage['lang'] = this.props.language
		}
	}
	render() {
		const paths = constructLocalizedSitePath(this.props.language)
		return (
			<Provider
				basename={this.props.basename}
				language={this.props.language}
				tracker={tracker}
				sitePaths={paths}
				reduxMiddlewares={middlewares}
				onStoreCreated={store => {
					persistEverything()(store)
					persistSimulation(store)
				}}
				initialStore={{
					...retrievePersistedState(),
					previousSimulation: retrievePersistedSimulation()
				}}>
				<TrackPageView />
				<div id="content">
					<RouterSwitch />
				</div>
			</Provider>
		)
	}
}

let RouterSwitch = compose(withTranslation())(() => {
	return (
		<Switch>
			<Route exact path="/" component={Landing} />
			<Route path="/iframes" component={Iframes} />
			<Route component={App} />
		</Switch>
	)
})

const App = compose(
	withSitePaths,
	withTranslation()
)(({ sitePaths, t }) => (
	<div className="app-container">
		<Helmet titleTemplate={`%s | ${t(['siteName', 'Mon-entreprise.fr'])}`} />
		{/* Passing location down to prevent update blocking */}
		{!inIframe() && <Navigation location={location} />}

		<div className="app-content">
			{!inIframe() && <Header />}
			<div className="ui__ container" style={{ flexGrow: 1, flexShrink: 0 }}>
				<Switch>
					<Route path={sitePaths.entreprise.index} component={CompanyIndex} />
					<Route
						path={sitePaths.sécuritéSociale.index}
						component={SocialSecurity}
					/>
					<Route
						path={sitePaths.démarcheEmbauche.index}
						component={HiringProcess}
					/>
					<Route
						path={sitePaths.documentation.index}
						component={Documentation}
					/>
					<Route exact path="/dev/sitemap" component={Sitemap} />
					<Route
						exact
						path="/dev/integration-test"
						component={IntegrationTest}
					/>

					<Route component={Route404} />
				</Switch>
			</div>

			{!inIframe() && <Footer />}
		</div>
	</div>
))

let ExportedApp = InFranceRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(InFranceRoute)
}

export default ExportedApp
