import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/types/errorboundary'
import rules from 'modele-social'
import { ComponentProps, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, redirect } from 'react-router-dom'
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
import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import { Container, Spacing } from '@/design-system/layout'

import Provider, { ProviderProps } from './Provider'
import { useAxeCoreAnalysis } from './hooks/useAxeCoreAnalysis'
import { useGetFullURL } from './hooks/useGetFullURL'
import { useSaveAndRestoreScrollPosition } from './hooks/useSaveAndRestoreScrollPosition'
import Accessibilité from './pages/Accessibilité'
import Budget from './pages/Budget/Budget'
import Créer from './pages/Creer'
import IntegrationTest from './pages/Dev/IntegrationTest'
import Personas from './pages/Dev/Personas'
import Documentation from './pages/Documentation'
import Iframes from './pages/Iframes'
import Landing from './pages/Landing/Landing'
import Nouveautés from './pages/Nouveautes/Nouveautes'
import Offline from './pages/Offline'
import Plan from './pages/Plan'
import Simulateurs from './pages/Simulateurs'
import Stats from './pages/Stats/LazyStats'
import Assistants from './pages/assistants'
import Gérer from './pages/gerer'
import Integration from './pages/integration/index'
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
		// Disable react strict mode cause react-spectrum doesn't support it
		// issue https://github.com/adobe/react-spectrum/issues/779
		// <StrictMode>
		<Provider basename={basename}>
			<EngineProvider value={engine}>
				<Router />
			</EngineProvider>
		</Provider>
		// </StrictMode>
	)
}

const Router = () => {
	const engine = useEngine()

	useSetupSafeSituation(engine)

	return (
		<Routes>
			<Route index element={<Landing />} />
			<Redirections />
			<Route path="/iframes/*" element={<Iframes />} />
			<Route path="*" element={<App />} />
		</Routes>
	)
}
const Redirections = () => {
	const { relativeSitePaths } = useSitePaths()

	return (
		<>
			<Route
				path="/stats"
				element={<Navigate to={relativeSitePaths.stats} replace />}
			/>
			<Route
				path={'/plan-de-site'}
				element={<Navigate to={relativeSitePaths.plan} replace />}
			/>
			<Route
				path={'/site-map'}
				element={<Navigate to={relativeSitePaths.plan} replace />}
			/>
		</>
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
				<a href={`${fullURL}#footer`} className="skip-link print-hidden">
					{t('Passer le contenu')}
				</a>
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
								path={relativeSitePaths.assistants.index + '/*'}
								element={<Assistants />}
							/>
							<Route
								path={relativeSitePaths.simulateurs.index + '/*'}
								element={<Simulateurs />}
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
							<Route path={relativeSitePaths.stats} e lement={<Stats />} />
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
