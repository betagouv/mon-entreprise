import { SelectSimulationYear } from '@/components/SelectSimulationYear'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import IndépendantExplanation from '@/components/simulationExplanation/IndépendantExplanation'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const IndépendantPLSimulation = () => (
	<>
		<Simulation
			explanations={<IndépendantExplanation />}
			afterQuestionsSlot={<SelectSimulationYear />}
		>
			<SimulateurWarning simulateur="profession-libérale" />
			<IndépendantSimulationGoals legend="Vos revenus de profession libérale" />
		</Simulation>
	</>
)
