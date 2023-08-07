import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import { ScrollToTop } from '@/components/utils/Scroll'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

export default function Assistants() {
	const { absoluteSitePaths } = useSitePaths()
	const location = useLocation()
	const simulateurs = useSimulatorsData()

	return (
		<>
			<ScrollToTop key={location.pathname} />

			<Routes>
				<Route
					index
					element={
						<Navigate to={absoluteSitePaths.simulateursEtAssistants} replace />
					}
				/>

				{Object.entries(simulateurs)
					.filter(([, simu]) => simu.pathId.startsWith('assistants.'))
					.map(([, simu]) => (
						<Route
							key={simu.path}
							path={
								simu.path.replace(absoluteSitePaths.assistants.index, '') + '/*'
							}
							element={
								<>
									<SimulateurOrAssistantPage />
								</>
							}
						/>
					))}
				<Route
					path="*"
					element={
						<Navigate
							to={decodeURI(location.pathname).replace(
								absoluteSitePaths.assistants.index,
								absoluteSitePaths.assistants['pour-mon-entreprise'].index
							)}
							replace
						/>
					}
				/>
			</Routes>
		</>
	)
}
