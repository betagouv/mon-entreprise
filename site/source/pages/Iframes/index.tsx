import Route404 from '@/components/Route404'
import { IsEmbeded } from '@/components/utils/embeddedContext'
import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import SimulateurPage from '../../components/PageData'
import useSimulatorsData from '../Simulateurs/metadata'
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
			<Routes>
				{Object.values(simulators)
					.filter((el) => !!('iframePath' in el && el.iframePath))
					.map(
						(s) =>
							'iframePath' in s &&
							s.iframePath && (
								<Route
									key={s.iframePath}
									path={'/' + encodeURI(s.iframePath) + '/*'}
									element={
										<>
											<Helmet>
												<link rel="canonical" href={s.path} />
											</Helmet>
											<SimulateurPage {...s} />
										</>
									}
								/>
							)
					)}
				<Route path="*" element={<Route404 />} />
			</Routes>
			<IframeFooter />
		</IsEmbeded>
	)
}
