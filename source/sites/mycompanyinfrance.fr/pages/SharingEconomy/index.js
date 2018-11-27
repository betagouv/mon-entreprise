import React from 'react'
import { Route } from 'react-router-dom'
import sitePath from '../../sitePaths'
// import CoConsommation from './CoConsomation'
import Home from './Home'
// import LocationBien from './LocationBien'
// import LocationLogement from './LocationLogement'
// import VenteBiens from './VenteBiens'
// import VenteServices from './VenteServices'

export default () => (
	<>
		<Route path={sitePath().économieCollaborative.index} component={Home} />
		{/* <Route
			path={sitePath().économieCollaborative.locationLogement}
			component={LocationLogement}
		/>
		<Route
			path={sitePath().économieCollaborative.locationBiens}
			component={LocationBien}
		/>
		<Route
			path={sitePath().économieCollaborative.venteServices}
			component={VenteServices}
		/>
		<Route
			path={sitePath().économieCollaborative.venteBiens}
			component={VenteBiens}
		/>
		<Route
			path={sitePath().économieCollaborative.coConsommation}
			component={CoConsommation}
		/> */}
	</>
)
