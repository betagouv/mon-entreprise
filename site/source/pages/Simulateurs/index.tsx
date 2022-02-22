import { useIsEmbedded } from '~/components/utils/embeddedContext'
import { usePersistingState } from '~/components/utils/persistState'
import { ScrollToTop } from '~/components/utils/Scroll'
import { SitePathsContext } from '~/components/utils/SitePathsContext'
import { Link } from '~/design-system/typography/link'
import { useContext, useEffect, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch, useLocation } from 'react-router-dom'
import Home from './Home'
import useSimulatorsData from './metadata'
import SimulateurPage from './Page'

export default function Simulateurs() {
	const sitePaths = useContext(SitePathsContext)
	const { state, pathname } = useLocation()
	const [lastState, setLastState] = usePersistingState<{
		fromGérer?: boolean
		fromCréer?: boolean
		fromSimulateurs?: boolean
	}>('navigation::simulateurs::locationState::v2')
	useEffect(() => {
		if (state) {
			setLastState(state as any)
		}
	}, [setLastState, state])
	const simulatorsData = useSimulatorsData()
	const isEmbedded = useIsEmbedded()
	const simulatorRoutes = useMemo(
		() =>
			Object.values(simulatorsData)
				.filter(({ path }) => path?.startsWith(sitePaths.simulateurs.index))
				.map((s) => (
					<Route
						key={s.path}
						path={s.path}
						render={() => <SimulateurPage {...s} />}
					/>
				)),
		[simulatorsData, sitePaths]
	)
	return (
		<>
			<ScrollToTop key={pathname} />

			{pathname !== sitePaths.simulateurs.index &&
				(lastState?.fromGérer ? (
					<Link to={sitePaths.gérer.index}>
						← <Trans>Retour à mon activité</Trans>
					</Link>
				) : lastState?.fromCréer ? (
					<Link to={sitePaths.créer.index}>
						← <Trans>Retour à la création</Trans>
					</Link>
				) : !isEmbedded ? (
					(!lastState || lastState?.fromSimulateurs) && (
						<Link className="print-hidden" to={sitePaths.simulateurs.index}>
							← <Trans>Voir les autres simulateurs</Trans>
						</Link>
					)
				) : null)}
			<Switch>
				<Route exact path={sitePaths.simulateurs.index} component={Home} />
				{simulatorRoutes}
			</Switch>
		</>
	)
}
