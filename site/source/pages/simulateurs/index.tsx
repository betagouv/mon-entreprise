import { useEffect, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'

import { usePersistingState } from '@/components/utils/persistState'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Link } from '@/design-system'
import { useIsEmbedded } from '@/hooks/useIsEmbedded'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

import SimulateurOrAssistantPage from '../../components/SimulateurOrAssistantPage'

type State = {
	fromGérer?: boolean
	fromCréer?: boolean
	fromSimulateurs?: boolean
}

export default function Simulateurs() {
	const { absoluteSitePaths } = useSitePaths()
	const { currentPath: pathname, locationState: state } = useNavigation()
	const [lastState, setLastState] = usePersistingState<State>(
		'navigation::simulateurs::locationState::v2',
		{}
	)
	useEffect(() => {
		if (state) {
			setLastState(state as State)
		}
	}, [setLastState, state])
	const simulatorsData = useSimulatorsData()
	const simulatorRoutes = useMemo(
		() =>
			Object.values(simulatorsData)
				.filter(
					({ path }) => path?.startsWith(absoluteSitePaths.simulateurs.index)
				)
				.map((s) => (
					<Route
						key={s.path}
						path={
							s.path.replace(absoluteSitePaths.simulateurs.index, '') + '/*'
						}
						element={<SimulateurOrAssistantPage />}
					/>
				)),
		[simulatorsData, absoluteSitePaths]
	)
	const isEmbedded = useIsEmbedded()

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
				{simulatorRoutes}
				<Route path="*" element={<Navigate to="/404" replace />} />
			</Routes>
		</>
	)
}
