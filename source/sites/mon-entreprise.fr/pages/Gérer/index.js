import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router'
import Embaucher from './Embaucher'
import Home from './Home'
import SchemeSelection from './SchemeSelection'
import SécuritéSociale from './SécuritéSociale'


export default function Gérer() {
	const sitePaths = useContext(SitePathsContext);
	return (
		<>
			<ScrollToTop />
			<Switch>
				<Route exact path={sitePaths.gérer.index} component={Home} />

				<Route
					path={sitePaths.gérer.selection}
					component={SchemeSelection}
				/>
				<Route
					path={sitePaths.gérer.sécuritéSociale}
					component={SécuritéSociale}
				/>
				<Route path={sitePaths.gérer.embaucher} component={Embaucher} />

			</Switch>
		</>
	);
}