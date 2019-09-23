import Route404 from 'Components/Route404'
import withSitePaths from 'Components/utils/withSitePaths'
import 'iframe-resizer'
import { compose } from 'ramda'
import createRavenMiddleware from 'raven-for-redux'
import Raven from 'raven-js'
import React, { useEffect } from 'react'
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
import { inIframe, setToSessionStorage } from '../../utils'
import './App.css'
import Footer from './layout/Footer/Footer'
import { PrivacyContent } from './layout/Footer/Privacy'
import Header from './layout/Header/Header'
import Navigation from './layout/Navigation/Navigation'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import CompanyIndex from './pages/Company'
import Couleur from './pages/Dev/Couleur'
import IntegrationTest from './pages/Dev/IntegrationTest'
import Personas from './pages/Dev/Personas'
import Sitemap from './pages/Dev/Sitemap'
import Documentation from './pages/Documentation'
import HiringProcess from './pages/HiringProcess'
import Iframes from './pages/Iframes'
import Landing from './pages/Landing/Landing.js'
import SocialSecurity from './pages/SocialSecurity'
import ÉconomieCollaborative from './pages/ÉconomieCollaborative'
import { constructLocalizedSitePath } from './sitePaths'
import { rules as baseRulesEn, rulesFr as baseRulesFr } from 'Engine/rules'

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

function InFranceRoute({ basename, language }) {
	useEffect(() => {
		setToSessionStorage('lang', language)
	}, [language])
	const paths = constructLocalizedSitePath(language)
	const rules = language === 'en' ? baseRulesEn : baseRulesFr
	return (
		<Provider
			basename={basename}
			language={language}
			tracker={tracker}
			sitePaths={paths}
			reduxMiddlewares={middlewares}
			onStoreCreated={store => {
				persistEverything({ except: ['rules'] })(store)
				persistSimulation(store)
			}}
			initialStore={{
				...retrievePersistedState(),
				previousSimulation: retrievePersistedSimulation(),
				rules
			}}>
			<RouterSwitch />
		</Provider>
	)
}

let RouterSwitch = () => {
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
}

const App = compose(withSitePaths)(({ sitePaths }) => {
	const { t } = useTranslation()
	return (
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
							path={sitePaths.économieCollaborative.index}
							component={ÉconomieCollaborative}
						/>
						<Route
							path={sitePaths.documentation.index}
							component={Documentation}
						/>
						<Route path={sitePaths.privacy.index} component={PrivacyContent} />
						<Route exact path="/dev/sitemap" component={Sitemap} />
						<Route
							exact
							path="/dev/integration-test"
							component={IntegrationTest}
						/>
						<Route exact path="/dev/couleur" component={Couleur} />
						<Route exact path="/dev/personas" component={Personas} />

						<Route component={Route404} />
					</Switch>
				</div>

				{!inIframe() && <Footer />}
			</div>
		</div>
	)
})

let ExportedApp = InFranceRoute

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(InFranceRoute)
}

export default ExportedApp
