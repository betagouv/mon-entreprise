import { Route, Routes } from 'react-router-dom'

import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import SimulateurPageLayout from '@/pages/simulateurs/SimulateurPageLayout'
import { useSitePaths } from '@/sitePaths'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import { IsBPIProvider } from './_components/useIsEmbededBPI'
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

const nextSteps = ['coût-création-entreprise'] satisfies SimulateurId[]

export default function ChoixDuStatut() {
	const simulateurConfig = useSimulatorData('choix-statut')
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const { relativeSitePaths } = useSitePaths()
	const currentStep = useCurrentStep()
	const childrenPaths = relativeSitePaths.assistants['choix-du-statut']

	return (
		<IsBPIProvider>
			<ScrollToTop key={currentStep} />

			<EngineProvider value={engine}>
				<SimulateurPageLayout
					simulateurConfig={simulateurConfig}
					isReady={isReady}
					nextSteps={nextSteps}
				>
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
				</SimulateurPageLayout>
			</EngineProvider>
		</IsBPIProvider>
	)
}
