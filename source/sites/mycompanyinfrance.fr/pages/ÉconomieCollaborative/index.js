import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route } from 'react-router'
import ActivitésSelection from './ActivitésSelection'
import CoConsommation from './CoConsommation'
import Home from './Home'
import LocationMeublée from './LocationMeublée'
import VotreSituation from './VotreSituation'
import { StoreProvider } from './StoreContext'
import Activité from './Activité'

export default withSitePaths(function ÉconomieCollaborative({ sitePaths }) {
	return (
		<StoreProvider>
			<>
				<Route
					exact
					path={sitePaths.économieCollaborative.index}
					component={Home}
				/>
				<Route
					exact
					path={sitePaths.économieCollaborative.activités.index}
					component={ActivitésSelection}
				/>
				<Route
					path={sitePaths.économieCollaborative.activités.index + '/:title'}
					component={Activité}
				/>
				<Route
					exact
					path={sitePaths.économieCollaborative.activités.locationMeublée}
					component={LocationMeublée}
				/>
				<Route
					exact
					path={sitePaths.économieCollaborative.votreSituation}
					component={VotreSituation}
				/>
			</>
		</StoreProvider>
	)
})
