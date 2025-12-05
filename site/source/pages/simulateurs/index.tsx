import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'
import { Suspense } from 'react'
import { Trans } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import SimulateurOrAssistantPageWithPublicodes from '@/components/SimulateurOrAssistantPageWithPublicodes'
import Loader from '@/components/utils/Loader'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Link } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

import { PageConfig } from './_configs/types'

export default function Simulateurs() {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const [lastState] = useNavigationOrigin()
	const isEmbedded = useIsEmbedded()
	const simulateursEtAssistants = useSimulatorsData()
	const simulateurs = pipe(
		simulateursEtAssistants,
		R.values,
		A.filter((s) =>
			(s as PageConfig).path.startsWith(absoluteSitePaths.simulateurs.index)
		)
	) as PageConfig[]

	return (
		<>
			<ScrollToTop key={currentPath} />

			{currentPath !== absoluteSitePaths.simulateurs.index &&
				(lastState?.fromGérer ? (
					<Link
						to={absoluteSitePaths.assistants['pour-mon-entreprise'].index}
						noUnderline
					>
						<span aria-hidden>←</span> <Trans>Retour à mon activité</Trans>
					</Link>
				) : !isEmbedded ? (
					(!lastState || lastState?.fromSimulateurs) && (
						<Link
							className="print-hidden"
							to={absoluteSitePaths.simulateurs.index}
							noUnderline
						>
							<span aria-hidden>←</span>{' '}
							<Trans>Voir les autres simulateurs</Trans>
						</Link>
					)
				) : null)}
			<Routes>
				<Route
					index
					element={
						<Navigate to={absoluteSitePaths.simulateursEtAssistants} replace />
					}
				/>
				{simulateurs.map((s) => (
					<Route
						key={s.path}
						path={
							s.path?.replace(absoluteSitePaths.simulateurs.index, '') + '/*'
						}
						element={
							<Suspense fallback={<Loader />}>
								{s.withPublicodes === false ? (
									<>
										<SimulateurOrAssistantPage />
									</>
								) : (
									<>
										<SimulateurOrAssistantPageWithPublicodes />
									</>
								)}
							</Suspense>
						}
					/>
				))}
				<Route path="*" element={<Navigate to="/404" replace />} />
			</Routes>
		</>
	)
}
