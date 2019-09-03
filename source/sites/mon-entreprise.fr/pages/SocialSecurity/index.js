import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route, Switch } from 'react-router'
import AssimiléSalarié from './AssimiléSalarié'
import AutoEntrepreneur from './AutoEntrepreneur'
import Home from './Home'
import Indépendant from './Indépendant'
import Salarié from './Salarié/index'
import SchemeComparaison from './SchemeComparaison'
import SchemeSelection from './SchemeSelection'

const SocialSecurityRoutes = ({ sitePaths }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route exact path={sitePaths.sécuritéSociale.index} component={Home} />
			<Route
				path={sitePaths.sécuritéSociale.salarié.index}
				component={Salarié}
			/>
			<Route
				path={sitePaths.sécuritéSociale.comparaison}
				component={SchemeComparaison}
			/>
			<Route
				path={sitePaths.sécuritéSociale['assimilé-salarié']}
				component={AssimiléSalarié}
			/>
			<Route
				path={sitePaths.sécuritéSociale.indépendant}
				component={Indépendant}
			/>
			<Route
				path={sitePaths.sécuritéSociale.selection}
				component={SchemeSelection}
			/>
			<Route
				path={sitePaths.sécuritéSociale['auto-entrepreneur']}
				component={AutoEntrepreneur}
			/>
		</Switch>
	</>
)

export default withSitePaths(SocialSecurityRoutes)
