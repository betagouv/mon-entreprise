import Banner from 'Components/Banner'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route, Switch } from 'react-router'
import AssimiléSalarié from './AssimiléSalarié'
import AutoEntrepreneur from './AutoEntrepreneur'
import Home from './Home'
import Indépendant from './Indépendant'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'
import SchemeSelection from './SchemeSelection'

const SocialSecurityRoutes = ({ sitePaths }) => (
	<>
		<ScrollToTop />
		<Switch>
			<Route exact path={sitePaths.sécuritéSociale.index} component={Home} />
			<Route
				path={sitePaths.sécuritéSociale.salarié}
				component={() => (
					<>
						<Banner icon="✨">
							Le simulateur d'embauche évolue et devient{' '}
							<strong>mon-entreprise.fr !</strong>{' '}
							<a href="https://pad.etalab.studio/s/By2X4Z2rV#">
								Lire nos explications
							</a>
						</Banner>
						<Salarié />
					</>
				)}
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
