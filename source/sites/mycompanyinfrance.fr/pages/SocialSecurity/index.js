import RulePage from 'Components/RulePage'
import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import { Route, Switch } from 'react-router'
import Home from './Home'

const SocialSecurityRoutes = ({ match }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route path={`${match.path}/règle/:name`} component={RulePage} />
			<Route path={`${match.path}`} component={Home} />
		</Switch>
	</>
)

export default SocialSecurityRoutes
