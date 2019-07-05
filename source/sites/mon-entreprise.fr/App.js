import Route404 from 'Components/Route404'
import withSitePaths from 'Components/utils/withSitePaths'
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
import Tracker, { devTracker } from '../../Tracker'
import { inIframe, setToSessionStorage } from '../../utils'
import './App.css'
import Footer from './layout/Footer/Footer'
import Header from './layout/Header/Header'
import Navigation from './layout/Navigation/Navigation'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import CompanyIndex from './pages/Company'
import Couleur from './pages/Dev/Couleur'
import IntegrationTest from './pages/Dev/IntegrationTest'
import Sitemap from './pages/Dev/Sitemap'
import Documentation from './pages/Documentation'
import HiringProcess from './pages/HiringProcess'
import Iframes from './pages/Iframes'
import Landing from './pages/Landing/Landing.js'
import SocialSecurity from './pages/SocialSecurity'
import { constructLocalizedSitePath } from './sitePaths'

if (process.env.NODE_ENV === 'production') {
	Raven.config(
		'https://9051375f856646d694943532caf2b45f@sentry.data.gouv.fr/18'
	).install()
}

let tracker = devTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new Tracker()
}

const middlewares = [
	createRavenMiddleware(Raven),
	trackSimulatorActions(tracker)
]

class InFranceRoute extends Component {
	componentDidMount() {
		setToSessionStorage('lang', this.props.language)
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
				<div id="content">
					<RouterSwitch />
				</div>
			</Provider>
		)
	}
}

let RouterSwitch = compose(withTranslation())(() => {
	return (
		<>
			{!inIframe() && <Navigation location={location} />}
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route path="/iframes" component={Iframes} />
				<Route component={App} />
			</Switch>
		</>
	)
})

const App = compose(
	withSitePaths,
	withTranslation()
)(({ sitePaths, t }) => (
	<div className="app-container">
		<Helmet titleTemplate={`%s | ${t(['siteName', 'Mon-entreprise.fr'])}`} />
		{/* Passing location down to prevent update blocking */}

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
					<Route exact path="/dev/couleur" component={Couleur} />

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
