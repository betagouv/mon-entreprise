import { usePersistingState } from 'Components/utils/persistState'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { Link, Route, Switch, useLocation } from 'react-router-dom'
import ArtisteAuteur from './ArtisteAuteur'
import AssimiléSalarié from './RémunérationSASU'
import ChômagePartiel from './ChômagePartiel'
import ProfessionnelSanté from './ProfessionnelSanté'
import AutoEntrepreneur from './AutoEntrepreneur'
import Home from './Home'
import Indépendant from './Indépendant'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'
import ÉconomieCollaborative from './ÉconomieCollaborative'

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
				<Route path={sitePaths.simulateurs.SASU} component={AssimiléSalarié} />
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
				<Route
					path={sitePaths.simulateurs['chômage-partiel']}
					component={ChômagePartiel}
				/>
				<Route
					path={sitePaths.simulateurs['professionnel-santé']}
					component={ProfessionnelSanté}
				/>
				<Route
					path={sitePaths.simulateurs.économieCollaborative.index}
					component={ÉconomieCollaborative}
				/>
			</Switch>
		</>
	)
}
