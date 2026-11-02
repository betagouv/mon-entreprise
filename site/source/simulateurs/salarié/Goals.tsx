import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

import Aides from './components/Aides'
import TitresRestaurant from './components/TitresRestaurant'

export default function SalariéSimulationGoals() {
	return (
		<SimulationGoals>
			<PeriodSwitch />
			<SimulationGoal dottedName="salarié . coût total employeur" />
			<Aides />

			<SimulationGoal dottedName="salarié . contrat . salaire brut" />
			<SimulationGoal
				small
				dottedName="salarié . contrat . salaire brut . équivalent temps plein"
			/>
			<SimulationGoal dottedName="salarié . rémunération . net . à payer avant impôt" />
			<TitresRestaurant />
			<SimulationGoal dottedName="salarié . rémunération . net . payé après impôt" />
		</SimulationGoals>
	)
}
