import * as Sentry from '@sentry/browser'
import Route404 from 'Components/Route404'
import {
	EngineProvider,
	SituationProvider
} from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import Engine from 'Engine'
import 'iframe-resizer'
import React, { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import createSentryMiddleware from 'redux-sentry-middleware'
import rulesFr, { Rules } from 'Rules'
import {
	configSituationSelector,
	situationSelector
} from 'Selectors/simulationSelectors'
import 'Ui/index.css'
import Provider, { ProviderProps } from '../../Provider'
import {
	persistEverything,
	retrievePersistedState
} from '../../storage/persistEverything'
import {
	persistSimulation,
	retrievePersistedSimulation
} from '../../storage/persistSimulation'
import Tracker, { devTracker } from '../../Tracker'
import { inIframe } from '../../utils'
import './App.css'
import Footer from './layout/Footer/Footer'
import Header from './layout/Header'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import Budget from './pages/Budget/Budget'
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
import Stats from './pages/Stats/LazyStats'
import ÉconomieCollaborative from './pages/ÉconomieCollaborative'
import redirects from './redirects'
import { constructLocalizedSitePath } from './sitePaths'
import { AvailableLangs } from 'i18n'

if (process.env.NODE_ENV === 'production') {
	const release =
		process.env.HEAD &&
		process.env.COMMIT_REF &&
		process.env.HEAD + '-' + process.env.COMMIT_REF?.substring(0, 7)
	const dsn = 'https://9051375f856646d694943532caf2b45f@sentry.data.gouv.fr/18'
	Sentry.init({ dsn, release })

	if (process.env.HEAD && process.env.HEAD !== 'master') {
		console.log(
			`ℹ Vous êtes sur la branche : %c${process.env.HEAD}`,
			'font-weight: bold; text-decoration: underline;'
		)
	}
}

let tracker = devTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new Tracker()
}

const middlewares = [
	createSentryMiddleware(Sentry),
	trackSimulatorActions(tracker)
]

type RootProps = {
	basename: ProviderProps['basename']
	rules: Rules
}

function Root({ basename, rules }: RootProps) {
	const { language } = useTranslation().i18n
	// Hot reload rules
	if (process.env.NODE_ENV !== 'production' && language === 'fr') {
		rules = rulesFr
	}

	const paths = constructLocalizedSitePath(language as AvailableLangs)
	return (
		<Provider
			basename={basename}
			tracker={tracker}
			sitePaths={paths}
			reduxMiddlewares={middlewares}
			onStoreCreated={store => {
				persistEverything({ except: ['simulation'] })(store)
				persistSimulation(store)
			}}
			initialStore={{
				...retrievePersistedState(),
				previousSimulation: retrievePersistedSimulation()
			}}
		>
			<EngineProvider value={new Engine(rules)}>
				<Router />
			</EngineProvider>
		</Provider>
	)
}

const Router = () => {
	const userSituation = useSelector(situationSelector)
	const configSituation = useSelector(configSituationSelector)
	const situation = useMemo(
		() => ({
			...configSituation,
			...userSituation
		}),
		[configSituation, userSituation]
	)
	return (
		<SituationProvider situation={situation}>
			{!inIframe() && <Header />}
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route path="/iframes" component={Iframes} />
				<Route component={App} />
			</Switch>
		</SituationProvider>
	)
}

const App = () => {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)

	return (
		<div className="app-container">
			<Helmet titleTemplate={`%s - ${t(['siteName', 'Mon-entreprise.fr'])}`} />
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
						<Route path={sitePaths.stats} component={Stats} />
						<Route path={sitePaths.coronavirus} component={Coronavirus} />
						<Route path={sitePaths.budget} component={Budget} />
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

let ExportedApp = Root

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Root)
}

export default ExportedApp
