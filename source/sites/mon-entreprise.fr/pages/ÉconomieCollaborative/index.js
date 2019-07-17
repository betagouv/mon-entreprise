import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import Activité from './Activité'
import ActivitésSelection from './ActivitésSelection'
import reducer from './reducer'
import { StoreProvider } from './StoreContext'
import VotreSituation from './VotreSituation'

export default withSitePaths(function ÉconomieCollaborative({ sitePaths }) {
	return (
		<>
			<Link
				to={sitePaths.économieCollaborative.index}
				className="ui__ notice small simple button"
				style={{ position: 'relative', bottom: '-2rem' }}>
				Revenus de plateformes en ligne >
			</Link>
			<StoreProvider
				reducer={reducer}
				localStorageKey="app::économie-collaborative:v0">
				<Switch>
					<Route
						exact
						path={sitePaths.économieCollaborative.index}
						component={ActivitésSelection}
					/>
					<Route
						path={sitePaths.économieCollaborative.votreSituation}
						component={VotreSituation}
					/>
					<Route
						path={sitePaths.économieCollaborative.index + '/:title'}
						component={Activité}
					/>
				</Switch>
			</StoreProvider>
		</>
	)
})
