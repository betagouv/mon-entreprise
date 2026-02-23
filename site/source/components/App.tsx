import { ErrorBoundary } from '@sentry/react'
import { StrictMode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { css, styled } from 'styled-components'

import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import { Container } from '@/design-system'
import { useAxeCoreAnalysis } from '@/hooks/useAxeCoreAnalysis'
import { useDocumentationPath } from '@/hooks/useDocumentationIndexPath'
import { useEngineFromModèle } from '@/hooks/useEngineFromModèle'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { usePlausibleTracking } from '@/hooks/usePlausibleTracking'
import { useSaveAndRestoreScrollPosition } from '@/hooks/useSaveAndRestoreScrollPosition'
import Landing from '@/pages/_landing/Landing'
import Page404 from '@/pages/404'
import Accessibilité from '@/pages/Accessibilité'
import Assistants from '@/pages/assistants/index'
import Budget from '@/pages/budget/index'
import IntegrationTest from '@/pages/dev/IntegrationTest'
import Documentation from '@/pages/documentation/Documentation'
import Iframes from '@/pages/iframes'
import IframeFooter from '@/pages/iframes/IframeFooter'
import Integration from '@/pages/integration/index'
import Nouveautés from '@/pages/nouveautés/index'
import { CatchOffline } from '@/pages/Offline'
import Plan from '@/pages/Plan'
import Simulateurs from '@/pages/simulateurs'
import SimulateursEtAssistants from '@/pages/simulateurs-et-assistants'
import Stats from '@/pages/statistiques'
import { useSitePaths } from '@/sitePaths'

import Provider, { ProviderProps } from './Provider'
import Redirections from './Redirections'

type RootProps = {
	basename: ProviderProps['basename']
}

export default function Root({ basename }: RootProps) {
	return (
		<StrictMode>
			<Provider basename={basename}>
				<Redirections>
					<ErrorBoundary fallback={CatchOffline}>
						<Router />
					</ErrorBoundary>
				</Redirections>
			</Provider>
		</StrictMode>
	)
}

const Router = () => {
	return (
		<Routes>
			<Route path="/iframes/*" element={<Iframes />} />
			<Route path="*" element={<App />} />
		</Routes>
	)
}

const App = () => {
	const { relativeSitePaths } = useSitePaths()

	useSaveAndRestoreScrollPosition()
	usePlausibleTracking()

	const isEmbedded = useIsEmbedded()
	if (!import.meta.env.PROD && import.meta.env.VITE_AXE_CORE_ENABLED) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useAxeCoreAnalysis()
	}

	const documentationPathModèleSocial = useDocumentationPath('modele-social')
	const engineModèleSocial = useEngineFromModèle('modele-social')
	const documentationPathModèleTI = useDocumentationPath('modele-ti')
	const engineModèleTI = useEngineFromModèle('modele-ti')
	const documentationPathModèleAS = useDocumentationPath('modele-as')
	const engineModèleAS = useEngineFromModèle('modele-as')

	return (
		<StyledLayout $isEmbedded={isEmbedded}>
			{!isEmbedded && <Header />}

			<main
				role="main"
				id="main"
				style={{
					flex: '1',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Container>
					<Routes>
						<Route index element={<Landing />} />

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
							path={relativeSitePaths.documentation.index + '/modele-ti/*'}
							element={
								<Documentation
									documentationPath={documentationPathModèleTI}
									engine={engineModèleTI}
									nomModèle="modele-ti"
								/>
							}
						/>
						<Route
							path={relativeSitePaths.documentation.index + '/modele-as/*'}
							element={
								<Documentation
									documentationPath={documentationPathModèleAS}
									engine={engineModèleAS}
									nomModèle="modele-as"
								/>
							}
						/>
						<Route
							path={relativeSitePaths.documentation.index + '/*'}
							element={
								<Documentation
									documentationPath={documentationPathModèleSocial}
									engine={engineModèleSocial}
									nomModèle="modele-social"
								/>
							}
						/>
						<Route
							path={relativeSitePaths.développeur.index + '/*'}
							element={<Integration />}
						/>
						<Route
							path={relativeSitePaths.nouveautés.index + '/*'}
							element={<Nouveautés />}
						/>
						<Route path={relativeSitePaths.stats} element={<Stats />} />
						<Route path={relativeSitePaths.budget} element={<Budget />} />
						<Route
							path={relativeSitePaths.accessibilité}
							element={<Accessibilité />}
						/>

						<Route path="/dev/integration-test" element={<IntegrationTest />} />

						<Route path={relativeSitePaths.plan} element={<Plan />} />

						<Route path="*" element={<Page404 />} />
					</Routes>
				</Container>
			</main>

			{isEmbedded ? <IframeFooter /> : <Footer />}
		</StyledLayout>
	)
}

const StyledLayout = styled.div<{
	$isEmbedded: boolean
}>`
	${({ $isEmbedded }) =>
		!$isEmbedded &&
		css`
			flex-direction: column;
			display: flex;
			height: 100%;
		`}

	min-height: 100vh;
`
