import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import Loadable from 'react-loadable'
import { Route, Switch } from 'react-router'
import Home from './Home'

const RulePage = Loadable({
	loader: () => import('Components/RulePage'),
	loading: () => null
})
const SocialSecurityRoutes = ({ match }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route path={`${match.path}`} component={Home} />
			<Route path={`${match.path}/règle/:name`} component={RulePage} />
		</Switch>
	</>
)

export default SocialSecurityRoutes
