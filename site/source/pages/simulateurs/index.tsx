import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'
import { Suspense, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import Loader from '@/components/utils/Loader'
import { usePersistingState } from '@/components/utils/persistState'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Link } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import { PageConfig } from './_configs/types'

type State = {
	fromGérer?: boolean
	fromCréer?: boolean
	fromSimulateurs?: boolean
}

export default function Simulateurs() {
	const { absoluteSitePaths } = useSitePaths()
	const { state, pathname } = useLocation()
	const [lastState, setLastState] = usePersistingState<State>(
		'navigation::simulateurs::locationState::v2',
		{}
	)
	useEffect(() => {
		if (state) {
			setLastState(state as State)
		}
	}, [setLastState, state])
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
			<ScrollToTop key={pathname} />

			{pathname !== absoluteSitePaths.simulateurs.index &&
				(lastState?.fromGérer ? (
					<Link
						to={absoluteSitePaths.assistants['pour-mon-entreprise'].index}
						noUnderline
					>
						<span aria-hidden>←</span> <Trans>Retour à mon activité</Trans>
					</Link>
				) : lastState?.fromCréer ? (
					<Link
						to={absoluteSitePaths.assistants['choix-du-statut'].index}
						noUnderline
					>
						<span aria-hidden>←</span> <Trans>Retour à la création</Trans>
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
								<SimulateurOrAssistantPage />
							</Suspense>
						}
					/>
				))}
				<Route path="*" element={<Navigate to="/404" replace />} />
			</Routes>
		</>
	)
}
