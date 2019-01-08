import RulePage from 'Components/RulePage'
import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import { Route, Switch } from 'react-router'
import AssimiléSalarié from './AssimiléSalarié'
import Home from './Home'
import Indépendant from './Indépendant'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'

const SocialSecurityRoutes = ({ match }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route exact path={`${match.path}`} component={Home} />
			<Route path={`${match.path}/règle/:name`} component={RulePage} />
			<Route path={`${match.path}/salarié`} component={Salarié} />
			<Route
				path={`${
					match.path
				}/comparaison-assimilé-salarié-indépendant-et-micro-entreprise`}
				component={SchemeComparaison}
			/>
			<Route
				path={`${match.path}/assimilé-salarié`}
				component={AssimiléSalarié}
			/>
			<Route path={`${match.path}/indépendant`} component={Indépendant} />
		</Switch>
	</>
)

export default SocialSecurityRoutes
