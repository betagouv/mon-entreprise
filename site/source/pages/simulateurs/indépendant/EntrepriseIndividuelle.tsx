import AvertissementRéformeAssietteNonImplémentée from '@/components/AvertissementRéformeAssietteNonImplémentée'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const EntrepriseIndividuelle = () => (
	<>
		<Simulation
			explanations={<IndépendantExplanation />}
			afterQuestionsSlot={<YearSelectionBanner />}
		>
			<SimulateurWarning
				simulateur="entreprise-individuelle"
				informationsComplémentaires={
					<AvertissementRéformeAssietteNonImplémentée />
				}
			/>
			<IndépendantSimulationGoals />
		</Simulation>
	</>
)
