import RulePage from 'Components/RulePage'
import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
import { Route, Switch } from 'react-router'
import sitePaths from '../../sitePaths'
import AssimiléSalarié from './AssimiléSalarié'
import Home from './Home'
import Indépendant from './Indépendant'
import MicroEntreprise from './MicroEntreprise'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'

const SocialSecurityRoutes = () => {
	const paths = sitePaths()
	return (
		<>
			<ScrollToTop />
			<Switch>
				<Route exact path={paths.sécuritéSociale.index} component={Home} />
				<Route
					path={paths.sécuritéSociale.index + '/règle/:name'}
					component={RulePage}
				/>
				<Route path={paths.sécuritéSociale.salarié} component={Salarié} />
				<Route
					path={paths.sécuritéSociale.comparaison}
					component={SchemeComparaison}
				/>
				<Route
					path={paths.sécuritéSociale['assimilé-salarié']}
					component={AssimiléSalarié}
				/>
				<Route
					path={paths.sécuritéSociale.indépendant}
					component={Indépendant}
				/>
				<Route
					path={paths.sécuritéSociale['micro-entreprise']}
					component={MicroEntreprise}
				/>
			</Switch>
		</>
	)
}

export default SocialSecurityRoutes
