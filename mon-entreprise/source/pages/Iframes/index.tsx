import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import { TrackingContext } from '../../ATInternetTracking'
import { INDICATOR } from '../../ATInternetTracking/Tracker'
import useSimulatorsData from '../Simulateurs/metadata'
import SimulateurPage from '../Simulateurs/Page'
import IframeFooter from './IframeFooter'

export default function Iframes() {
	const simulators = useSimulatorsData()
	useContext(TrackingContext).customVars.set({
		site: { [INDICATOR.SITE.EMBARQUÉ]: 1 },
	})
	return (
		<IsEmbeddedContext.Provider value={true}>
			{/** Open external links in the parent frame.
			This behavior can be configured on individual link, eg <a target="_blank" />.
			Our own link are handled in-app by the router, and aren't affected by this directive.
			*/}

			<base target="_parent" />
			<div className="ui__ container">
				<Switch>
					{Object.values(simulators)
						.filter(({ iframe }) => !!iframe)
						.map((s) => (
							<Route
								key={s.iframe}
								path={`/iframes/${s.iframe}`}
								render={() => (
									<>
										<Helmet>
											<link rel="canonical" href={s.path} />
										</Helmet>
										<SimulateurPage {...s} />
									</>
								)}
							/>
						))}
				</Switch>
				<IframeFooter />
			</div>
		</IsEmbeddedContext.Provider>
	)
}
