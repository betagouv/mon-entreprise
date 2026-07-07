import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'
import { Navigate, Route, Routes } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useNavigation } from '@/lib/navigation/index'
import { useSitePaths } from '@/sitePaths'

import { PageConfig } from '../simulateurs/_configs/types'
import ChargesSocialesIndépendant from './declaration-charges-sociales-independant/index'
import AideDéclarationIndépendant from './declaration-revenu-independants/index'
import DéclarationRevenusPAMC from './declaration-revenus-pamc/index'
import DemandeMobilité from './demande-mobilite/index'
import ÉconomieCollaborative from './economie-collaborative/index'

export default function Assistants() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const simulateursEtAssistants = useSimulatorsData()
	const assistants = pipe(
		simulateursEtAssistants,
		R.values,
		A.filter((s) => (s as PageConfig).pathId.startsWith('assistants.'))
	) as PageConfig[]

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
				{/* Assistants décomissionnés */}
				<Route
					path={
						relativeSitePaths.assistants[
							'declaration-charges-sociales-independant'
						]
					}
					element={<ChargesSocialesIndépendant />}
				/>
				<Route
					path={relativeSitePaths.assistants['declaration-revenus-pamc']}
					element={<DéclarationRevenusPAMC />}
				/>
				<Route
					path={relativeSitePaths.assistants.declarationIndépendant.index}
					element={<AideDéclarationIndépendant />}
				/>
				<Route
					path={relativeSitePaths.assistants.économieCollaborative.index}
					element={<ÉconomieCollaborative />}
				/>
				<Route
					path={relativeSitePaths.assistants.formulaireMobilité}
					element={<DemandeMobilité />}
				/>
				{/* Tous les simulateur et assistants */}
				{assistants.map((assistant) => (
					<Route
						key={assistant.path}
						path={
							assistant.path?.replace(absoluteSitePaths.assistants.index, '') +
							'/*'
						}
						element={<SimulateurOrAssistantPage />}
					/>
				))}
			</Routes>
		</>
	)
}
