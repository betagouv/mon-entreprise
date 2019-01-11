import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route, Switch } from 'react-router'
import AssimiléSalarié from './AssimiléSalarié'
import Home from './Home'
import Indépendant from './Indépendant'
import MicroEntreprise from './MicroEntreprise'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'

const SocialSecurityRoutes = ({ sitePaths }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route exact path={sitePaths.sécuritéSociale.index} component={Home} />
			<Route path={sitePaths.sécuritéSociale.salarié} component={Salarié} />
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
				path={sitePaths.sécuritéSociale['micro-entreprise']}
				component={MicroEntreprise}
			/>
		</Switch>
	</>
)

export default withSitePaths(SocialSecurityRoutes)
