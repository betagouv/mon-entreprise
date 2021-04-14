import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { NavLink, Route, Switch, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import useSimulatorsData from '../Simulateurs/metadata'
import PageData from '../Simulateurs/Page'
import Embaucher from './Embaucher'
import Home from './Home'
import SécuritéSociale from './SécuritéSociale'

export default function Gérer() {
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
	const simulateurs = useSimulatorsData()
	return (
		<>
			<ScrollToTop key={location.pathname} />
			<div css="transform: translateY(2rem);">
				<NavLink
					to={sitePaths.gérer.index}
					exact
					activeClassName="ui__ hide"
					className="ui__ simple push-left small button"
				>
					← <Trans>Retour à mon activité</Trans>
				</NavLink>
			</div>
			<TrackChapter chapter1="gerer" />
			<Switch>
				<Route exact path={sitePaths.gérer.index} component={Home} />
				<Route
					path={sitePaths.gérer.sécuritéSociale}
					component={SécuritéSociale}
				/>
				<Route path={sitePaths.gérer.embaucher} component={Embaucher} />
				{[
					simulateurs['aide-déclaration-indépendant'],
					simulateurs['demande-mobilité'],
				].map((p) => (
					<Route
						key={p.shortName}
						exact
						path={p.path}
						render={() => <PageData {...p} />}
					/>
				))}
			</Switch>
		</>
	)
}
