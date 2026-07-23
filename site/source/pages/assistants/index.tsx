import { Navigate, Route, Routes } from 'react-router-dom'

import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

import ChoixDuStatut from './choix-du-statut'
import CMG from './cmg'
import ChargesSocialesIndépendant from './declaration-charges-sociales-independant'
import AideDéclarationIndépendant from './declaration-revenu-independants'
import DéclarationRevenusPAMC from './declaration-revenus-pamc'
import DemandeMobilité from './demande-mobilité'
import ÉconomieCollaborative from './économie-collaborative'
import PourMonEntreprise from './pour-mon-entreprise'
import SearchCodeApePage from './recherche-code-ape'

export default function Assistants() {
	const { absoluteSitePaths, relativeSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const assistants = relativeSitePaths.assistants

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
					path={assistants['déclaration-charges-sociales-indépendant']}
					element={<ChargesSocialesIndépendant />}
				/>
				<Route
					path={assistants['déclaration-revenus-pamc']}
					element={<DéclarationRevenusPAMC />}
				/>
				<Route
					path={assistants.déclarationIndépendant.index}
					element={<AideDéclarationIndépendant />}
				/>
				<Route
					path={assistants.économieCollaborative.index}
					element={<ÉconomieCollaborative />}
				/>
				<Route
					path={assistants.formulaireMobilité}
					element={<DemandeMobilité />}
				/>

				<Route
					path={assistants['choix-du-statut'].index + '/*'}
					element={<ChoixDuStatut />}
				/>
				<Route path={assistants.cmg.index + '/*'} element={<CMG />} />
				<Route
					path={assistants['pour-mon-entreprise'].index + '/*'}
					element={<PourMonEntreprise />}
				/>
				<Route
					path={assistants['recherche-code-ape'] + '/*'}
					element={<SearchCodeApePage />}
				/>
			</Routes>
		</>
	)
}
