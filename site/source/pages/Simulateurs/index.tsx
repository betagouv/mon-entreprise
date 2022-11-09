import { useIsEmbedded } from '@/components/utils/useIsEmbedded'
import { usePersistingState } from '@/components/utils/persistState'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Link } from '@/design-system/typography/link'
import { useSitePaths } from '@/sitePaths'
import { useEffect, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'
import SimulateurPage from '../../components/PageData'
import Home from './Home'
import useSimulatorsData from './metadata'

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
	const simulatorsData = useSimulatorsData()
	const simulatorRoutes = useMemo(
		() =>
			Object.values(simulatorsData)
				.filter(({ path }) =>
					path?.startsWith(absoluteSitePaths.simulateurs.index)
				)
				.map((s) => (
					<Route
						key={s.path}
						path={
							s.path.replace(absoluteSitePaths.simulateurs.index, '') + '/*'
						}
						element={<SimulateurPage {...s} />}
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
					<Link to={absoluteSitePaths.gérer.index}>
						<span aria-hidden>←</span> <Trans>Retour à mon activité</Trans>
					</Link>
				) : lastState?.fromCréer ? (
					<Link to={absoluteSitePaths.créer.index}>
						<span aria-hidden>←</span> <Trans>Retour à la création</Trans>
					</Link>
				) : !isEmbedded ? (
					(!lastState || lastState?.fromSimulateurs) && (
						<Link
							className="print-hidden"
							to={absoluteSitePaths.simulateurs.index}
						>
							<span aria-hidden>←</span>{' '}
							<Trans>Voir les autres simulateurs</Trans>
						</Link>
					)
				) : null)}
			<Routes>
				<Route index element={<Home />} />
				{simulatorRoutes}
			</Routes>
		</>
	)
}
