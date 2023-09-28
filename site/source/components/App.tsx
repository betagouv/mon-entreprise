import { ErrorBoundary } from '@sentry/react'
import rules from 'modele-social'
import { StrictMode, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'
import { css, styled } from 'styled-components'

import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import {
	engineFactory,
	EngineProvider,
	Rules,
	useEngine,
	useSetupSafeSituation,
} from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Container, Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useAxeCoreAnalysis } from '@/hooks/useAxeCoreAnalysis'
import { useGetFullURL } from '@/hooks/useGetFullURL'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useSaveAndRestoreScrollPosition } from '@/hooks/useSaveAndRestoreScrollPosition'
import Landing from '@/pages/_landing/Landing'
import Page404 from '@/pages/404'
import Accessibilité from '@/pages/Accessibilité'
import Assistants from '@/pages/assistants/index'
import Budget from '@/pages/budget/index'
import IntegrationTest from '@/pages/dev/IntegrationTest'
import Documentation from '@/pages/Documentation'
import Iframes from '@/pages/iframes'
import Integration from '@/pages/integration/index'
import Nouveautés from '@/pages/nouveautés/index'
import { CatchOffline } from '@/pages/Offline'
import Plan from '@/pages/Plan'
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
			<EngineProvider value={engine}>
				<Provider basename={basename}>
					<Redirections>
						<ErrorBoundary fallback={CatchOffline}>
							<BadNews />
							<Router />
						</ErrorBoundary>
					</Redirections>
				</Provider>
			</EngineProvider>
		</StrictMode>
	)
}

const BadNews = () => {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<aside
			aria-label={t('badnews.label', 'Information importante')}
			style={{
				display: 'flex',
				justifyContent: 'center',
				position: 'relative',
				top: '0.25rem',
				zIndex: 2,
			}}
		>
			<Message
				className="print-hidden"
				type="error"
				icon={<Emoji emoji="💔" />}
				mini
				border={false}
				style={{ margin: 0 }}
			>
				<Body>
					<Trans i18nKey="badnews.body">
						<strong>Important :</strong> La mise à jour des simulateurs et le
						support utilisateur ne sont plus assurés.{' '}
						<Link to={absoluteSitePaths.nouveautés.index}>En savoir plus.</Link>
					</Trans>
				</Body>
			</Message>
		</aside>
	)
}

const Router = () => {
	const engine = useEngine()

	useSetupSafeSituation(engine)

	return (
		<Routes>
			<Route
				path="/iframes/*"
				element={
					<>
						{/* Spacing added for BadNews */}
						<Spacing xs />
						<Iframes />
					</>
				}
			/>
			<Route path="*" element={<App />} />
		</Routes>
	)
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
				<a
					href={`${fullURL}#footer`}
					aria-label={t(
						'Passer le contenu principal et aller directement au pied de page'
					)}
					className="skip-link print-hidden"
				>
					{t('Aller directement au pied de page')}
				</a>
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

			{!isEmbedded && <Footer />}
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
