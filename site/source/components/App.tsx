import { ErrorBoundary } from '@sentry/react'
import { FallbackRender } from '@sentry/react/types/errorboundary'
import rules from 'modele-social'
import { ComponentProps, StrictMode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
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
import Budget from '@/pages/Budget/Budget'
import Créer from '@/pages/Creer'
import IntegrationTest from '@/pages/Dev/IntegrationTest'
import Documentation from '@/pages/Documentation'
import Iframes from '@/pages/Iframes'
import Landing from '@/pages/Landing/Landing'
import Nouveautés from '@/pages/Nouveautes/Nouveautes'
import Offline from '@/pages/Offline'
import Plan from '@/pages/Plan'
import Simulateurs from '@/pages/Simulateurs'
import Stats from '@/pages/Stats/LazyStats'
import Assistants from '@/pages/assistants/index'
import Integration from '@/pages/integration/index'
import { useSitePaths } from '@/sitePaths'

import Provider, { ProviderProps } from './Provider'

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

const Redirections = ({ children }: { children: React.ReactNode }) => {
	const { absoluteSitePaths } = useSitePaths()
	const redirections = [
		{
			paths: ['/stats'],
			to: absoluteSitePaths.stats,
		},
		{
			paths: ['/plan-de-site', '/site-map'],
			to: absoluteSitePaths.plan,
		},
		{
			paths: [
				'/gérer/aide-declaration-independants/beta',
				'/manage/declaration-aid-independent/beta',
			],
			to: absoluteSitePaths.assistants.déclarationIndépendant.index,
		},
		{
			paths: [
				'/gérer/aide-declaration-independants',
				'/manage/declaration-aid-independent',
			],
			to: absoluteSitePaths.assistants[
				'déclaration-charges-sociales-indépendant'
			],
		},
	] satisfies { paths: string[]; to: string }[]

	return (
		<Routes>
			{redirections.flatMap(({ paths, to }) =>
				paths.map((path) => (
					<Route
						key={path}
						path={path}
						element={<Navigate to={to} replace />}
					/>
				))
			)}
			<Route path="*" element={children} />
		</Routes>
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
