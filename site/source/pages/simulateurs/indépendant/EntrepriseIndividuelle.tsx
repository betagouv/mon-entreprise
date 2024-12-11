import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const EntrepriseIndividuelle = () => (
	<>
		<Simulation
			explanations={<IndépendantExplanation />}
			afterQuestionsSlot={<SelectSimulationYear />}
		>
			<SimulateurWarning simulateur="entreprise-individuelle" />
			<IndépendantSimulationGoals legend="Vos revenus d'entreprise individuelle" />
		</Simulation>
	</>
)
