import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import { ScrollToTop } from '@/components/utils/Scroll'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import AideDéclarationIndépendant from './declaration-revenu-independants'

export default function Assistants() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const location = useLocation()
	const simulateurs = useSimulatorsData()
	console.log(
		'location.pathname',
		location.pathname,
		absoluteSitePaths.assistants.déclarationIndépendant.index
	)

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
				<Route
					path={relativeSitePaths.assistants.déclarationIndépendant.index}
					element={
						<>
							<AideDéclarationIndépendant />
						</>
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
			</Routes>
		</>
	)
}
