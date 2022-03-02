import { ThemeColorsProvider } from '@/components/utils/colors'
import { IsEmbeded } from '@/components/utils/embeddedContext'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
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
		<IsEmbeded>
			{/** Open external links in the parent frame.
			This behavior can be configured on individual link, eg <a target="_blank" />.
			Our own link are handled in-app by the router, and aren't affected by this directive.
			*/}
			<base target="_parent" />
			<div data-iframe-height>
				<ThemeColorsProvider>
					<Switch>
						{Object.values(simulators)
							.filter((el) => !!('iframePath' in el && el.iframePath))
							.map(
								(s) =>
									'iframePath' in s &&
									s.iframePath && (
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
									)
							)}
					</Switch>
					<IframeFooter />
				</ThemeColorsProvider>
			</div>
		</IsEmbeded>
	)
}
