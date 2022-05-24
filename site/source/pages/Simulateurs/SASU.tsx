import PeriodSwitch from '@/components/PeriodSwitch'
import SimulateurWarning from '@/components/SimulateurWarning'
import Simulation, {
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import SalaryExplanation from '@/components/simulationExplanation/SalaryExplanation'

export function SASUSimulation() {
	return (
		<>
			<Simulation explanations={<SalaryExplanation />}>
				<SimulateurWarning simulateur="sasu" />
				<SimulationGoals
					toggles={<PeriodSwitch />}
					legend="Vos revenus de dirigeant de SASU"
				>
					<SimulationGoal dottedName="dirigeant . rémunération . totale" />
					<SimulationGoal
						editable={false}
						small
						dottedName="salarié . cotisations"
					/>
					<SimulationGoal dottedName="salarié . rémunération . net . à payer avant impôt" />
					<SimulationGoal small editable={false} dottedName="impôt . montant" />
					<SimulationGoal dottedName="salarié . rémunération . net . payé après impôt" />
				</SimulationGoals>
			</Simulation>
		</>
	)
}
