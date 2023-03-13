import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/types/errorboundary'
import rules from 'modele-social'
import { ComponentProps, StrictMode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import styled, { css } from 'styled-components'

import Route404 from '@/components/Route404'
import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import {
	EngineProvider,
	Rules,
	engineFactory,
	useEngine,
	useSetupSafeSituation,
} from '@/components/utils/EngineContext'
import { Container, Spacing } from '@/design-system/layout'
import { useAxeCoreAnalysis } from '@/hooks/useAxeCoreAnalysis'
import { useGetFullURL } from '@/hooks/useGetFullURL'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useSaveAndRestoreScrollPosition } from '@/hooks/useSaveAndRestoreScrollPosition'
import Accessibilité from '@/pages/Accessibilité'
import Documentation from '@/pages/Documentation'
import Offline from '@/pages/Offline'
import Plan from '@/pages/Plan'
import Landing from '@/pages/_landing/Landing'
import Assistants from '@/pages/assistants/index'
import Budget from '@/pages/budget/index'
import IntegrationTest from '@/pages/dev/IntegrationTest'
import Iframes from '@/pages/iframes'
import Integration from '@/pages/integration/index'
import Nouveautés from '@/pages/nouveautés/index'
import Simulateurs from '@/pages/simulateurs'
import SimulateursEtAssistants from '@/pages/simulateurs-et-assistants'
import Stats from '@/pages/statistiques/LazyStats'
import { useSitePaths } from '@/sitePaths'

import Provider, { ProviderProps } from './Provider'
import Redirections from './Redirections'

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
					<Redirections>
						<Router />
					</Redirections>
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

	const { t } = useTranslation()

	const fullURL = useGetFullURL()

	useSaveAndRestoreScrollPosition()
	const isEmbedded = useIsEmbedded()
	if (!import.meta.env.PROD && import.meta.env.VITE_AXE_CORE_ENABLED) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useAxeCoreAnalysis()
	}
	const documentationPath = useSitePaths().absoluteSitePaths.documentation.index
	const engine = useEngine()

	return (
		<StyledLayout isEmbedded={isEmbedded}>
			{!isEmbedded && <Header />}

			<main role="main" id="main">
				<a
					href={`${fullURL}#footer`}
					aria-label={t(
						'Passer le contenu principal et aller directement au pied de page'
					)}
					className="skip-link print-hidden"
				>
					{t('Passer le contenu')}
				</a>
				<Container>
					<ErrorBoundary fallback={CatchOffline}>
						<Routes>
							<Route
								path={relativeSitePaths.assistants.index + '/*'}
								element={<Assistants />}
							/>
							<Route
								path={relativeSitePaths.simulateurs.index + '/*'}
								element={<Simulateurs />}
							/>
							<Route
								path={relativeSitePaths.simulateursEtAssistants + '/*'}
								element={<SimulateursEtAssistants />}
							/>
							<Route
								path={relativeSitePaths.documentation.index + '/*'}
								element={
									<Documentation
										documentationPath={documentationPath}
										engine={engine}
									/>
								}
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

							<Route path={relativeSitePaths.plan} element={<Plan />} />

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
	isEmbedded: boolean
}>`
	${({ isEmbedded }) =>
		!isEmbedded &&
		css`
			flex-direction: column;
			display: flex;
			height: 100%;
		`}
`
