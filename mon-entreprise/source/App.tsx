import Footer from 'Components/layout/Footer/Footer'
import Header from 'Components/layout/Header'
import Route404 from 'Components/Route404'
import 'Components/ui/index.css'
import {
	engineFactory,
	EngineProvider,
	Rules,
	SituationProvider,
} from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import 'iframe-resizer'
import { useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import {
	configSituationSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import './App.css'
import Accessibilité from './pages/Accessibilité'
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
import Provider, { ProviderProps } from './Provider'
import redirects from './redirects'
import { constructLocalizedSitePath } from './sitePaths'
import {
	retrievePersistedInFranceApp,
	setupInFranceAppPersistence,
} from './storage/persistInFranceApp'
import { setupSimulationPersistence } from './storage/persistSimulation'
import SearchButton from 'Components/SearchButton'

type RootProps = {
	basename: ProviderProps['basename']
	rules: Rules
}

export default function Root({ basename, rules }: RootProps) {
	const { language } = useTranslation().i18n
	const paths = constructLocalizedSitePath(language as 'fr' | 'en')
	const engine = useMemo(() => engineFactory(rules), [rules])
	return (
		<Provider
			basename={basename}
			sitePaths={paths}
			onStoreCreated={(store) => {
				setupInFranceAppPersistence(store)
				setupSimulationPersistence(store)
			}}
			initialStore={{
				inFranceApp: retrievePersistedInFranceApp(),
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
			...userSituation,
		}),
		[configSituation, userSituation]
	)
	return (
		<SituationProvider situation={situation}>
			<Switch>
				<Route exact path="/" component={Landing} />
				{/* Removes trailing slashes */}
				<Route
					path={'/:url*(/+)'}
					exact
					strict
					render={({ location }) => (
						<Redirect to={location.pathname.replace(/\/+$/, location.search)} />
					)}
				/>
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
					<div style={{ marginLeft: 'auto', marginRight: 0 }}>
						<SearchButton />
					</div>
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
						<Route path={sitePaths.accessibilité} component={Accessibilité} />
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
