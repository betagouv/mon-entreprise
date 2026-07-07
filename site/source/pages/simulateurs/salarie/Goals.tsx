import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation/index'

import Aides from './components/Aides'
import TitresRestaurant from './components/TitresRestaurant'

export default function SalariéSimulationGoals() {
	return (
		<SimulationGoals>
			<PeriodSwitch />
			<SimulationGoal dottedName="salarie . coût total employeur" />
			<Aides />

			<SimulationGoal dottedName="salarie . contrat . salaire brut" />
			<SimulationGoal
				small
				dottedName="salarie . contrat . salaire brut . équivalent temps plein"
			/>
			<SimulationGoal dottedName="salarie . rémunération . net . à payer avant impôt" />
			<TitresRestaurant />
			<SimulationGoal dottedName="salarie . rémunération . net . payé après impôt" />
		</SimulationGoals>
	)
}
