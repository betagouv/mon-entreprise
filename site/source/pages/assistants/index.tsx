import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as R from 'effect/Record'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import SimulateurOrAssistantPage from '@/components/SimulateurOrAssistantPage'
import SimulateurOrAssistantPageWithPublicodes from '@/components/SimulateurOrAssistantPageWithPublicodes'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import useSimulatorsData from '@/hooks/useSimulatorsData'
import { useSitePaths } from '@/sitePaths'

import { PageConfig } from '../simulateurs/_configs/types'
import ChargesSocialesIndépendant from './declaration-charges-sociales-independant'
import AideDéclarationIndépendant from './declaration-revenu-independants'
import DéclarationRevenusPAMC from './declaration-revenus-pamc'
import ÉconomieCollaborative from './économie-collaborative'

export default function Assistants() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const location = useLocation()
	const simulateursEtAssistants = useSimulatorsData()
	const assistants = pipe(
		simulateursEtAssistants,
		R.values,
		A.filter((s) => (s as PageConfig).pathId.startsWith('assistants.'))
	) as PageConfig[]

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
				{/* Assistants décomissionnés */}
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
				{assistants.map((assistant) => (
					<Route
						key={assistant.path}
						path={
							assistant.path?.replace(absoluteSitePaths.assistants.index, '') +
							'/*'
						}
						element={
							assistant.withPublicodes === false ? (
								<>
									<SimulateurOrAssistantPage />
								</>
							) : (
								<>
									<SimulateurOrAssistantPageWithPublicodes />
								</>
							)
						}
					/>
				))}
			</Routes>
		</>
	)
}
