import { IsEmbeddedContext } from 'Components/utils/embeddedContext'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Route, Switch } from 'react-router-dom'
import useSimulatorsData from '../Simulateurs/metadata'
import SimulateurPage from '../Simulateurs/Page'
import IframeFooter from './IframeFooter'

export default function Iframes() {
	const simulators = useSimulatorsData()

	// We hide the vertical scrollbar in the iframe because the iframe is resized
	// using the "iframe-resizer" module, and if we keep the scrollbar it appears
	// briefly during transitions, cf.
	// https://github.com/betagouv/mon-entreprise/issues/1462
	useEffect(() => {
		if ('parentIFrame' in window) {
			document.body.style.overflowY = 'hidden'
		}
	}, [])

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
						.filter(({ iframePath }) => !!iframePath)
						.map((s) => (
							<Route
								key={s.iframePath}
								path={`/iframes/${s.iframePath}`}
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
