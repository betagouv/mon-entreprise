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
import { Route, Routes } from 'react-router-dom'
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
			<Routes>
				<Route index element={<Landing />} />
				<Route path="/iframes/*" element={<Iframes />} />
				<Route path="*" element={<App />} />
			</Routes>
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
					<Routes>
						<Route path={sitePaths.créer.index + '/*'} element={<Créer />} />
						<Route path={sitePaths.gérer.index + '/*'} element={<Gérer />} />
						<Route
							path={sitePaths.simulateurs.index + '/*'}
							element={<Simulateurs />}
						/>
						<Route
							path={sitePaths.documentation.index + '/*'}
							element={<Documentation />}
						/>
						<Route
							path={sitePaths.développeur.index + '/*'}
							element={<Integration />}
						/>
						<Route
							path={sitePaths.nouveautés + '/*'}
							element={<Nouveautés />}
						/>
						<Route path={sitePaths.stats} element={<Stats />} />
						<Route path={sitePaths.budget} element={<Budget />} />
						<Route path={sitePaths.accessibilité} element={<Accessibilité />} />

						<Route path="/dev/integration-test" element={<IntegrationTest />} />
						<Route path="/dev/personas" element={<Personas />} />

						<Route path="*" element={<Route404 />} />
					</Routes>
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
