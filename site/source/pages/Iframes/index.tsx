import { ThemeColorsProvider } from '@/components/utils/colors'
import { IsEmbeded } from '@/components/utils/embeddedContext'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Route, Switch } from 'react-router-dom'
import useSimulatorsData from '../Simulateurs/metadata'
import SimulateurPage from '../../components/PageData'
import IframeFooter from './IframeFooter'

export default function Iframes() {
	const simulators = useSimulatorsData()

	return (
		<IsEmbeded>
			{/** Open external links in the parent frame.
			This behavior can be configured on individual link, eg <a target="_blank" />.
			Our own link are handled in-app by the router, and aren't affected by this directive.
			*/}
			<base target="_parent" />
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
		</IsEmbeded>
	)
}
