import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import { ScrollToTop } from '@/components/utils/Scroll'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import AideDéclarationIndépendant from './declaration-revenu-independants'
import ÉconomieCollaborative from './économie-collaborative'

export default function Assistants() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
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
				{/* Simulateurs et assistants décomissionnés */}
				<Route
					path={relativeSitePaths.assistants.déclarationIndépendant.index}
					element={<AideDéclarationIndépendant />}
				/>
				<Route
					path={relativeSitePaths.assistants.économieCollaborative.index}
					element={<ÉconomieCollaborative />}
				/>
				{/* Tous les simulateur et assistants */}
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
