import { Navigate, Route, Routes } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

import ChargesSocialesIndépendant from './declaration-charges-sociales-independant'
import AideDéclarationIndépendant from './declaration-revenu-independants'
import DéclarationRevenusPAMC from './declaration-revenus-pamc'
import ÉconomieCollaborative from './économie-collaborative'

export default function Assistants() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const simulateurs = useSimulatorsData()

	return (
		<>
			<ScrollToTop key={currentPath} />

			<Routes>
				<Route
					index
					element={
						<Navigate to={absoluteSitePaths.simulateursEtAssistants} replace />
					}
				/>
				{/* Simulateurs et assistants décomissionnés */}
				<Route
					path={
						relativeSitePaths.assistants[
							'déclaration-charges-sociales-indépendant'
						]
					}
					element={<ChargesSocialesIndépendant />}
				/>
				<Route
					path={relativeSitePaths.assistants['déclaration-revenus-pamc']}
					element={<DéclarationRevenusPAMC />}
				/>
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
