import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { Route } from 'react-router'
import Activité from './Activité'
import ActivitésSelection from './ActivitésSelection'
import LocationMeublée from './LocationMeublée'
import { StoreProvider } from './StoreContext'
import VotreSituation from './VotreSituation'

export default withSitePaths(function ÉconomieCollaborative({ sitePaths }) {
	return (
		<StoreProvider>
			<>
				<Route
					exact
					path={sitePaths.économieCollaborative.index}
					component={ActivitésSelection}
				/>
				<Route
					path={sitePaths.économieCollaborative.index + '/:title'}
					component={Activité}
				/>
				<Route
					exact
					path={sitePaths.économieCollaborative.locationMeublée}
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
