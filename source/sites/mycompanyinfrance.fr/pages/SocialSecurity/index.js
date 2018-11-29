import RulePage from 'Components/RulePage'
import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import { Route, Switch } from 'react-router'
import Home from './Home'
import SimulateurSalarié from './SimulateurSalarié'
import SimulateurAssimilé from './SimulateurAssimilé'

const SocialSecurityRoutes = ({ match }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route path={`${match.path}/règle/:name`} component={RulePage} />
			<Route
				path={`${match.path}/assimilé-salarié`}
				component={SimulateurAssimilé}
			/>
			<Route path={`${match.path}/salarié`} component={SimulateurSalarié} />
			<Route path={`${match.path}`} component={Home} />
		</Switch>
	</>
)

export default SocialSecurityRoutes
