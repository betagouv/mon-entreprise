import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import { NavLink, useLocation } from 'react-router-dom'
import AideDéclarationIndépendant from './AideDéclarationIndépendant/index'
import Embaucher from './Embaucher'
import Home from './Home'
import SécuritéSociale from './SécuritéSociale'
import formulaireMobilitéIndépendant from './DemandeMobilite'

export default function Gérer() {
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
	return (
		<>
			<ScrollToTop key={location.pathname} />
			<NavLink
				to={sitePaths.gérer.index}
				exact
				activeClassName="ui__ hide"
				className="ui__ simple push-left small button"
			>
				← <Trans>Retour à mon activité</Trans>
			</NavLink>
			<Switch>
				<Route exact path={sitePaths.gérer.index} component={Home} />
				<Route
					path={sitePaths.gérer.sécuritéSociale}
					component={SécuritéSociale}
				/>
				<Route path={sitePaths.gérer.embaucher} component={Embaucher} />
				<Route
					exact
					path={sitePaths.gérer.déclarationIndépendant}
					component={AideDéclarationIndépendant}
				/>
				<Route
					exact
					path={sitePaths.gérer.formulaireMobilité}
					component={formulaireMobilitéIndépendant}
				/>
			</Switch>
		</>
	)
}
