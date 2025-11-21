import AvertissementRéformeAssietteNonImplémentée from '@/components/AvertissementRéformeAssietteNonImplémentée'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation from '@/components/Simulation'
import { YearSelectionBanner } from '@/components/Simulation/YearSelectionBanner'
import ExplicationsIndépendant from '@/pages/simulateurs/indépendant/components/Explications'
import { IndépendantSimulationGoals } from '@/pages/simulateurs/indépendant/Goals'

export const EntrepriseIndividuelle = () => (
	<>
		<Simulation
			explanations={<ExplicationsIndépendant />}
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
