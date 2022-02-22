import { ScrollToTop } from '~/components/utils/Scroll'
import { SitePathsContext } from '~/components/utils/SitePathsContext'
import { Link } from '~/design-system/typography/link'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useRouteMatch } from 'react-router'
import { Route, Switch, useLocation } from 'react-router-dom'
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
	const showLink = !useRouteMatch({ path: sitePaths.gérer.index, exact: true })
	return (
		<>
			<ScrollToTop key={location.pathname} />
			{showLink && (
				<Link to={sitePaths.gérer.index}>
					← <Trans>Retour à mon activité</Trans>
				</Link>
			)}

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
