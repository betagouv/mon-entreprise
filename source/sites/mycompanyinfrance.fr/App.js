import TrackPageView from 'Components/utils/TrackPageView'
import { defaultTracker } from 'Components/utils/withTracker'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import 'Ui/index.css'
import Provider from '../../Provider'
import {
	persistEverything,
	retrievePersistedState
} from '../../storage/persistEverything'
import ReactPiwik from '../../Tracker'
import './App.css'
import Footer from './layout/Footer/Footer'
import Navigation from './layout/Navigation/Navigation'
import ProgressHeader from './layout/ProgressHeader/ProgressHeader'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import CompanyIndex from './pages/Company'
import HiringProcess from './pages/HiringProcess'
import Landing from './pages/Landing'
import SocialSecurity from './pages/SocialSecurity'
import sitePaths from './sitePaths'

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
			sessionStorage['lang'] = 'en'
		}
	}
	render() {
		return (
			<Provider
				basename="infrance"
				language="fr"
				tracker={tracker}
				reduxMiddlewares={middlewares}
				initialStore={{ ...retrievePersistedState(), lang: 'en' }}
				onStoreCreated={persistEverything}>
				<TrackPageView />
				<div id="content">
					<RouterSwitch />
				</div>
			</Provider>
		)
	}
}

let RouterSwitch = translate()(() => {
	const paths = sitePaths()
	return (
		<Switch>
			<Route exact path="/" component={Landing} />
			<div className="app-container">
				{/* Passing location down to prevent update blocking */}
				<Navigation location={location} />
				<div className="app-content">
					<ProgressHeader />
					<div
						className="ui__ container"
						style={{ flexGrow: 1, flexShrink: 0 }}>
						<Route path={paths.entreprise.index} component={CompanyIndex} />
						<Route
							path={paths.sécuritéSociale.index}
							component={SocialSecurity}
						/>
						<Route
							path={paths.démarcheEmbauche.index}
							component={HiringProcess}
						/>
					</div>
					<Footer />
				</div>
			</div>
		</Switch>
	)
})

let ExportedApp = InFranceRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(InFranceRoute)
}

export default ExportedApp
