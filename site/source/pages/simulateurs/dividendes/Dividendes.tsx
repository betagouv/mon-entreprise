import { useTranslation } from 'react-i18next'

import Notifications from '@/components/Notifications'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import { DarkLi, Ul } from '@/design-system'
import useSimulationPublicodes from '@/hooks/useSimulationPublicodes'
import { useSimulatorData } from '@/hooks/useSimulatorData'
import { SimulateurId } from '@/hooks/useSimulatorsData'
import { EngineProvider } from '@/utils/publicodes/EngineContext'

import SimulateurPageLayout from '../SimulateurPageLayout'
import { Explications } from './components/Explications'
import { DividendesSimulationGoals } from './Goals'

const nextSteps = [
	'salarié',
	'is',
	'comparaison-statuts',
] satisfies SimulateurId[]

export default function DividendesSimulation() {
	const id = 'dividendes'
	const simulateurConfig = useSimulatorData(id)
	const { isReady, engine } = useSimulationPublicodes(simulateurConfig)

	const { t } = useTranslation()

	return (
		<EngineProvider value={engine}>
			<SimulateurPageLayout
				simulateurConfig={simulateurConfig}
				isReady={isReady}
				nextSteps={nextSteps}
			>
				<Notifications />
				<Simulation
					explanations={<Explications />}
					afterQuestionsSlot={<YearSelectionBanner />}
				>
					<SimulateurWarning
						simulateur="dividendes"
						informationsComplémentaires={
							<Ul>
								<DarkLi>
									{t(
										'pages.simulateurs.dividendes.warning.1',
										'Cette simulation ne concerne que les sociétés françaises à l’impôt sur les sociétés (IS), et ne concerne pas les travailleurs indépendants non salariés.'
									)}
								</DarkLi>
								<DarkLi>
									{t(
										'pages.simulateurs.dividendes.warning.2',
										'Le montant de l’impôt sur les dividendes est calculé en plus de l’impôt sur les autres revenus imposables.'
									)}
								</DarkLi>
							</Ul>
						}
					/>
					<DividendesSimulationGoals />
				</Simulation>
			</SimulateurPageLayout>
		</EngineProvider>
	)
}
