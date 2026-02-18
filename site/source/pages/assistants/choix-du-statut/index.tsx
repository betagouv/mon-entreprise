import { Route, Routes } from 'react-router-dom'

import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { useSitePaths } from '@/sitePaths'

import { IsBPIProvider } from './_components/useIsEmbeddedBPI'
import { useCurrentStep } from './_components/useSteps'
import Association from './association'
import Associé from './associé'
import Commune from './commune'
import Comparateur from './comparateur'
import DétailsActivité from './détails-activité'
import AccueilChoixStatut from './home'
import RechercheActivité from './recherche-activité'
import Rémunération from './rémunération'
import Résultat from './résultat'

export default function ChoixDuStatut() {
	const { relativeSitePaths } = useSitePaths()
	const currentStep = useCurrentStep()
	const childrenPaths = relativeSitePaths.assistants['choix-du-statut']

	return (
		<IsBPIProvider>
			<ScrollToTop key={currentStep} />
			<Routes>
				<Route index element={<AccueilChoixStatut />} />
				<Route
					path={childrenPaths['recherche-activité']}
					element={<RechercheActivité />}
				/>
				<Route
					path={childrenPaths['détails-activité']}
					element={<DétailsActivité />}
				/>
				<Route path={`${childrenPaths.commune}/*`} element={<Commune />} />
				<Route path={`${childrenPaths.associé}/*`} element={<Associé />} />
				<Route
					path={`${childrenPaths.association}/*`}
					element={<Association />}
				/>
				<Route
					path={`${childrenPaths.rémunération}/*`}
					element={<Rémunération />}
				/>
				<Route
					path={`${childrenPaths.résultat.index}/*`}
					element={<Résultat />}
				/>
				<Route
					path={`${childrenPaths.comparateur}/*`}
					element={<Comparateur />}
				/>
			</Routes>
		</IsBPIProvider>
	)
}
