import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch } from 'react-router'
import { NavLink, useLocation } from 'react-router-dom'
import AideDéclarationIndépendant from './AideDéclarationIndépendants'
import Embaucher from './Embaucher'
import Home from './Home'
import SécuritéSociale from './SécuritéSociale'

export default function Gérer() {
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
	return (
		<>
			<ScrollToTop key={location.pathname} />
			<div css="transform: translateY(2rem)">
				<NavLink
					to={sitePaths.gérer.index}
					exact
					activeClassName="ui__ hide"
					className="ui__ simple push-left small button"
				>
					← <Trans>Retour à mon activité</Trans>
				</NavLink>
			</div>
			<Switch>
				<Route exact path={sitePaths.gérer.index} component={Home} />
				<Route
					path={sitePaths.gérer.sécuritéSociale}
					component={SécuritéSociale}
				/>
				<Route path={sitePaths.gérer.embaucher} component={Embaucher} />
				<Route
					path={sitePaths.gérer.déclarationIndépendant}
					component={AideDéclarationIndépendant}
				/>
			</Switch>
		</>
	)
}
