import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import Route404 from '@/components/Route404'
import { useIsEmbedded } from '@/components/utils/embeddedContext'
import {
	engineFactory,
	EngineProvider,
	Rules,
	useEngine,
	useSetupSafeSituation,
} from '@/components/utils/EngineContext'
import { Container, Spacing } from '@/design-system/layout'
import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/types/errorboundary'
import rules from 'modele-social'
import { ComponentProps, StrictMode, useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { useSaveAndRestoreScrollPosition } from './hooks/useSaveAndRestoreScrollPosition'
import { useAxeCoreAnalysis } from './hooks/useAxeCoreAnalysis'
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
import { useSitePaths } from './sitePaths'

type RootProps = {
	basename: ProviderProps['basename']
	rulesPreTransform?: (rules: Rules) => Rules
}

export default function Root({
	basename,
	rulesPreTransform = (r) => r,
}: RootProps) {
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
			<Provider basename={basename}>
				<EngineProvider value={engine}>
					<Router />
				</EngineProvider>
			</Provider>
		</StrictMode>
	)
}

const Router = () => {
	const engine = useEngine()

	useSetupSafeSituation(engine)

	return (
		<Routes>
			<Route index element={<Landing />} />
			<Route path="/iframes/*" element={<Iframes />} />
			<Route path="*" element={<App />} />
		</Routes>
	)
}

const CatchOffline = ({ error }: ComponentProps<FallbackRender>) => {
	if (error.message.includes('dynamically imported module')) {
		return <Offline />
	} else {
		throw error
	}
}

const App = () => {
	const { relativeSitePaths } = useSitePaths()
	const isEmbedded = useIsEmbedded()

	useSaveAndRestoreScrollPosition()

	if (!import.meta.env.PROD && import.meta.env.VITE_AXE_CORE_ENABLED) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useAxeCoreAnalysis()
	}

	return (
		<StyledLayout isEmbeded={isEmbedded}>
			{!isEmbedded && <Header />}
			<main>
				<Container>
					<ErrorBoundary fallback={CatchOffline}>
						<Routes>
							<Route
								path={relativeSitePaths.créer.index + '/*'}
								element={<Créer />}
							/>
							<Route
								path={relativeSitePaths.gérer.index + '/*'}
								element={<Gérer />}
							/>
							<Route
								path={relativeSitePaths.simulateurs.index + '/*'}
								element={<Simulateurs />}
							/>
							<Route
								path={relativeSitePaths.documentation.index + '/*'}
								element={<Documentation />}
							/>
							<Route
								path={relativeSitePaths.développeur.index + '/*'}
								element={<Integration />}
							/>
							<Route
								path={relativeSitePaths.nouveautés + '/*'}
								element={<Nouveautés />}
							/>
							<Route path={relativeSitePaths.stats} element={<Stats />} />
							<Route path={relativeSitePaths.budget} element={<Budget />} />
							<Route
								path={relativeSitePaths.accessibilité}
								element={<Accessibilité />}
							/>

							<Route
								path="/dev/integration-test"
								element={<IntegrationTest />}
							/>
							<Route path="/dev/personas" element={<Personas />} />

							<Route path="*" element={<Route404 />} />
						</Routes>
						<Spacing xxl />
					</ErrorBoundary>
				</Container>
			</main>

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
