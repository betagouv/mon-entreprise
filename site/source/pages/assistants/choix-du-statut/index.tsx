import { Route, Routes, useLocation } from 'react-router-dom'

import { ScrollToTop } from '@/components/utils/Scroll'
import { useSitePaths } from '@/sitePaths'

import AfterRegistration from './après'
import Association from './association'
import Associé from './associé'
import Commune from './commune'
import DétailsActivité from './détails-activité'
import AccueilChoixStatut from './home'
import RechercheActivité from './recherche-activité'
import Rémunération from './rémunération'
import Résultat from './résultat'
import Statuts from './statuts'

export default function ChoixDuStatut() {
	const { relativeSitePaths } = useSitePaths()
	const location = useLocation()
	const childrenPaths = relativeSitePaths.assistants['choix-du-statut']

	return (
		<>
			<ScrollToTop key={location.pathname} />
			<Routes>
				<Route index element={<AccueilChoixStatut />} />
				<Route path={childrenPaths.après} element={<AfterRegistration />} />
				<Route
					path={childrenPaths['recherche-activité']}
					element={<RechercheActivité />}
				/>
				<Route
					path={childrenPaths['détails-activité']}
					element={<DétailsActivité />}
				/>
				<Route path={childrenPaths.commune} element={<Commune />} />
				<Route path={childrenPaths.associé} element={<Associé />} />
				<Route path={childrenPaths.association} element={<Association />} />
				<Route path={childrenPaths.rémunération} element={<Rémunération />} />
				<Route path={childrenPaths.résultat} element={<Résultat />} />
				<Route path={childrenPaths.statuts} element={<Statuts />} />
			</Routes>
		</>
	)
}
