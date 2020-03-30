import Route404 from 'Components/Route404'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import 'iframe-resizer'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
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
import { getSessionStorage, inIframe } from '../../utils'
import './App.css'
import Footer from './layout/Footer/Footer'
import Header from './layout/Header'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import Coronavirus from './pages/Coronavirus'
import Créer from './pages/Créer'
import IntegrationTest from './pages/Dev/IntegrationTest'
import Personas from './pages/Dev/Personas'
import Sitemap from './pages/Dev/Sitemap'
import Documentation from './pages/Documentation'
import Gérer from './pages/Gérer'
import Iframes from './pages/Iframes'
import Integration from './pages/integration/index'
import Landing from './pages/Landing/Landing'
import Nouveautés from './pages/Nouveautés/Nouveautés'
import Simulateurs from './pages/Simulateurs'
import ÉconomieCollaborative from './pages/ÉconomieCollaborative'
import redirects from './redirects'
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

function InFranceRoute({ basename, language, rules }) {
	useEffect(() => {
		getSessionStorage()?.setItem('lang', language)
	}, [language])
	const paths = constructLocalizedSitePath(language)
	return (
		<Provider
			basename={basename}
			language={language}
			tracker={tracker}
			sitePaths={paths}
			reduxMiddlewares={middlewares}
			onStoreCreated={store => {
				persistEverything({ except: ['rules', 'simulation'] })(store)
				persistSimulation(store)
			}}
			initialStore={{
				...retrievePersistedState(),
				previousSimulation: retrievePersistedSimulation(),
				rules
			}}
		>
			<RouterSwitch />
		</Provider>
	)
}

let RouterSwitch = () => {
	return (
		<>
			{!inIframe() && <Header />}
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route path="/iframes" component={Iframes} />
				<Route component={App} />
			</Switch>
		</>
	)
}

const App = () => {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	return (
		<div className="app-container">
			<Helmet titleTemplate={`%s | ${t(['siteName', 'Mon-entreprise.fr'])}`} />
			{/* Passing location down to prevent update blocking */}

			<div className="app-content">
				<div className="ui__ container" style={{ flexGrow: 1, flexShrink: 0 }}>
					<Switch>
						{redirects}
						<Route path={sitePaths.créer.index} component={Créer} />
						<Route path={sitePaths.gérer.index} component={Gérer} />
						<Route
							path={sitePaths.économieCollaborative.index}
							component={ÉconomieCollaborative}
						/>
						<Route path={sitePaths.simulateurs.index} component={Simulateurs} />
						<Route
							path={sitePaths.documentation.index}
							component={Documentation}
						/>
						<Route path={sitePaths.integration.index} component={Integration} />
						<Route path={sitePaths.nouveautés} component={Nouveautés} />
						<Route path={sitePaths.coronavirus} component={Coronavirus} />
						<Route exact path="/dev/sitemap" component={Sitemap} />
						<Route
							exact
							path="/dev/integration-test"
							component={IntegrationTest}
						/>
						<Route exact path="/dev/personas" component={Personas} />

						<Route component={Route404} />
					</Switch>
				</div>

				{!inIframe() && <Footer />}
			</div>
		</div>
	)
}

let ExportedApp = InFranceRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(InFranceRoute)
}

export default ExportedApp
