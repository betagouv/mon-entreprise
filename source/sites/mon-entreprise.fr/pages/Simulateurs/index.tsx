import { usePersistingState } from 'Components/utils/persistState'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import ArtisteAuteur from './ArtisteAuteur'
import AssimiléSalarié from './AssimiléSalarié'
import AutoEntrepreneur from './AutoEntrepreneur'
import Home from './Home'
import Indépendant from './Indépendant'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'

export default function Simulateurs() {
	const sitePaths = useContext(SitePathsContext)
	const { state, pathname } = useLocation()
	const [lastState, setLastState] = usePersistingState(
		'navigation::simulateurs::locationState::v2'
	)
	useEffect(() => {
		if (state) {
			setLastState(state)
		}
	}, [setLastState, state])
	return (
		<>
			<ScrollToTop key={pathname} />
			{pathname !== sitePaths.simulateurs.index && (
				<div css="transform: translateY(2rem);">
					{lastState?.fromGérer && (
						<Link
							to={sitePaths.gérer.index}
							className="ui__ simple small push-left button"
						>
							← <Trans>Retour à mon activité</Trans>
						</Link>
					)}
					{lastState?.fromCréer && (
						<Link
							to={sitePaths.créer.index}
							className="ui__ simple small push-left button"
						>
							← <Trans>Retour à la création</Trans>
						</Link>
					)}
					{(!lastState || lastState?.fromSimulateurs) && (
						<Link
							to={sitePaths.simulateurs.index}
							className="ui__ simple small push-left button"
						>
							← <Trans>Voir les autres simulateurs</Trans>
						</Link>
					)}
				</div>
			)}
			<Switch>
				<Route exact path={sitePaths.simulateurs.index} component={Home} />
				<Route path={sitePaths.simulateurs.salarié} component={Salarié} />
				<Route
					path={sitePaths.simulateurs.comparaison}
					component={SchemeComparaison}
				/>
				<Route
					path={sitePaths.simulateurs['assimilé-salarié']}
					component={AssimiléSalarié}
				/>
				<Route
					path={sitePaths.simulateurs.indépendant}
					component={Indépendant}
				/>
				<Route
					path={sitePaths.simulateurs['auto-entrepreneur']}
					component={AutoEntrepreneur}
				/>
				<Route
					path={sitePaths.simulateurs['artiste-auteur']}
					component={ArtisteAuteur}
				/>
			</Switch>
		</>
	)
}
