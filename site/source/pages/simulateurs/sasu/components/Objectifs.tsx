import PeriodSwitch from '@/components/PeriodSwitch'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'

export const Objectifs = () => {
	return (
		<SimulationGoals>
			<PeriodSwitch />
			<SimulationGoal dottedName="assimilé salarié . rémunération . totale" />
			<SimulationGoal dottedName="assimilé salarié . dividendes" />
			<SimulationGoal
				editable={false}
				small
				dottedName="assimilé salarié . cotisations . avec dividendes"
			/>
			<SimulationGoal dottedName="assimilé salarié . rémunération . nette . avec dividendes" />
			<SimulationGoal
				small
				editable={false}
				dottedName="assimilé salarié . rémunération . impôt . avec dividendes"
			/>
			<SimulationGoal dottedName="assimilé salarié . rémunération . nette . après impôt . avec dividendes" />
		</SimulationGoals>
	)
}
