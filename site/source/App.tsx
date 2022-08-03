import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import Route404 from '@/components/Route404'
import { useIsEmbedded } from '@/components/utils/embeddedContext'
import {
	engineFactory,
	EngineProvider,
	Rules,
	SituationProvider,
} from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Container, Spacing } from '@/design-system/layout'
import {
	companySituationSelector,
	configSituationSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/types/errorboundary'
import rules from 'modele-social'
import { ComponentProps, StrictMode, useContext, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { CompatRoute } from 'react-router-dom-v5-compat'
import styled, { css } from 'styled-components'
import Accessibilité from './pages/Accessibilité'
import Budget from './pages/Budget/Budget'
import Créer from './pages/Creer'
import IntegrationTest from './pages/Dev/IntegrationTest'
import Personas from './pages/Dev/Personas'
import Documentation from './pages/Documentation'
import Gérer from './pages/gerer'
import Iframes from './pages/Iframes'
import Integration from './pages/integration/index'
import Landing from './pages/Landing/Landing'
import Nouveautés from './pages/Nouveautes/Nouveautes'
import Offline from './pages/Offline'
import Simulateurs from './pages/Simulateurs'
import Stats from './pages/Stats/LazyStats'
import Provider, { ProviderProps } from './Provider'
import { constructLocalizedSitePath } from './sitePaths'

type RootProps = {
	basename: ProviderProps['basename']
	rulesPreTransform?: (rules: Rules) => Rules
}

export default function Root({
	basename,
	rulesPreTransform = (r) => r,
}: RootProps) {
	const { language } = useTranslation().i18n
	const paths = constructLocalizedSitePath(language as 'fr' | 'en')
	const engine = useMemo(
		() => engineFactory(rulesPreTransform(rules)),

		// We need to keep [rules] in the dependency list for hot reload of the rules
		// in dev mode, even if ESLint think it is unnecessary since `rules` isn't
		// defined in the component scope.
		//
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[rules]
	)

	return (
		<StrictMode>
			<Provider basename={basename} sitePaths={paths}>
				<EngineProvider value={engine}>
					<Router />
				</EngineProvider>
			</Provider>
		</StrictMode>
	)
}

const Router = () => {
	const simulatorSituation = useSelector(situationSelector)
	const configSituation = useSelector(configSituationSelector)
	const companySituation = useSelector(companySituationSelector)

	const situation = useMemo(
		() => ({
			...companySituation,
			...configSituation,
			...simulatorSituation,
		}),
		[configSituation, simulatorSituation, companySituation]
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

const CatchOffline = ({ error }: ComponentProps<FallbackRender>) => {
	if (error.message.includes('Failed to fetch dynamically imported module')) {
		return <Offline />
	} else {
		throw error
	}
}

const App = () => {
	const { t } = useTranslation()
	const sitePaths = useContext(SitePathsContext)
	const isEmbedded = useIsEmbedded()

	return (
		<StyledLayout isEmbeded={isEmbedded}>
			{!isEmbedded && <Header />}
			<Helmet
				titleTemplate={`${t(['site.titleTemplate', '%s - Mon-entreprise'])}`}
			/>

			<Container>
				<ErrorBoundary fallback={CatchOffline}>
					{/* Passing location down to prevent update blocking */}
					<Switch>
						<Route path={sitePaths.créer.index} component={Créer} />
						<Route path={sitePaths.gérer.index} component={Gérer} />
						<Route path={sitePaths.simulateurs.index} component={Simulateurs} />
						<Route
							path={sitePaths.documentation.index}
							component={Documentation}
						/>
						<Route path={sitePaths.développeur.index} component={Integration} />
						<Route path={sitePaths.nouveautés} component={Nouveautés} />
						<CompatRoute path={sitePaths.stats} component={Stats} />
						<Route path={sitePaths.budget} component={Budget} />
						<Route path={sitePaths.accessibilité} component={Accessibilité} />

						<Route
							exact
							path="/dev/integration-test"
							component={IntegrationTest}
						/>
						<Route exact path="/dev/personas" component={Personas} />

						<Route component={Route404} />
					</Switch>
					<Spacing xxl />
				</ErrorBoundary>
			</Container>

			{!isEmbedded && <Footer />}
		</StyledLayout>
	)
}

const StyledLayout = styled.div<{
	isEmbeded: boolean
}>`
	${({ isEmbeded }) =>
		!isEmbeded &&
		css`
			flex-direction: column;
			display: flex;
			height: 100%;
		`}
`
