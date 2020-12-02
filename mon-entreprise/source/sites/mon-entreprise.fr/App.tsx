import * as Sentry from '@sentry/browser'
import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import {
	EngineProvider,
	SituationProvider
} from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import 'iframe-resizer'
import Engine from 'publicodes'
import { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import createSentryMiddleware from 'redux-sentry-middleware'
import { Rules } from 'Rules'
import {
	configSituationSelector,
	situationSelector
} from 'Selectors/simulationSelectors'
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
import './App.css'
import Footer from './layout/Footer/Footer'
import Header from './layout/Header'
import trackSimulatorActions from './middlewares/trackSimulatorActions'
import Budget from './pages/Budget/Budget'
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
import redirects from './redirects'
import { constructLocalizedSitePath } from './sitePaths'

if (process.env.NODE_ENV === 'production') {
	let branch: string | undefined = process.env.GITHUB_REF?.split('/')?.slice(
		-1
	)?.[0]
	if (branch === 'merge') {
		branch = process.env.GITHUB_HEAD_REF
	}
	const release =
		branch && `${branch}-` + process.env.GITHUB_SHA?.substring(0, 7)
	const dsn = 'https://9051375f856646d694943532caf2b45f@sentry.data.gouv.fr/18'
	Sentry.init({ dsn, release })

	if (branch && branch !== 'master') {
		console.log(
			`ℹ Vous êtes sur la branche : %c${branch}`,
			'font-weight: bold; text-decoration: underline;'
		)
	}
}

let tracker = devTracker
if (process.env.NODE_ENV === 'production') {
	tracker = new Tracker()
}

const middlewares = [
	createSentryMiddleware(Sentry as any),
	trackSimulatorActions(tracker)
]

type RootProps = {
	basename: ProviderProps['basename']
	rules: Rules
}

export default function Root({ basename, rules }: RootProps) {
	const { language } = useTranslation().i18n
	const paths = constructLocalizedSitePath(language as 'fr' | 'en')
	const engine = useMemo(() => new Engine(rules), [rules])
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
			<EngineProvider value={engine}>
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
		<>
			<Header />
			<div className="app-container">
				<Helmet
					titleTemplate={`${t(['site.titleTemplate', '%s - Mon-entreprise'])}`}
				/>
				{/* Passing location down to prevent update blocking */}
				<div className="ui__ container app-content">
					<Switch>
						{redirects}
						<Route path={sitePaths.créer.index} component={Créer} />
						<Route path={sitePaths.gérer.index} component={Gérer} />
						<Route path={sitePaths.simulateurs.index} component={Simulateurs} />
						<Route
							path={sitePaths.documentation.index}
							component={Documentation}
						/>
						<Route path={sitePaths.integration.index} component={Integration} />
						<Route path={sitePaths.nouveautés} component={Nouveautés} />
						<Route path={sitePaths.stats} component={Stats} />
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
				<Footer />
			</div>
		</>
	)
}
