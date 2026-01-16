import { Helmet } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'

import { usePlausibleTracking } from '@/hooks/usePlausibleTracking'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import Page404 from '@/pages/404'

import SimulateurOrAssistantPage from '../../components/SimulateurOrAssistantPage'
import { PageConfig } from '../simulateurs/_configs/types'
import IframeFooter from './IframeFooter'

export default function Iframes() {
	usePlausibleTracking()
	const simulatorsData = useSimulatorsData()
	const simulateursEtAssistants = Object.values(simulatorsData) as PageConfig[]

	return (
		<>
			{/** Open external links in the parent frame.
			This behavior can be configured on individual link, eg <a target="_blank" />.
			Our own link are handled in-app by the router, and aren't affected by this directive.
			*/}
			<base target="_parent" />
			<Routes>
				{simulateursEtAssistants.map((s) => (
					<Route
						key={s.iframePath}
						path={s.iframePath + '/*'}
						element={
							<>
								<Helmet>
									<link rel="canonical" href={s.path} />
								</Helmet>
								<SimulateurOrAssistantPage />
							</>
						}
					/>
				))}
				<Route path="*" element={<Page404 />} />
			</Routes>
			<IframeFooter />
		</>
	)
}
